/* ============================================================
   CEP — Resolução de CEP + roteamento de unidade
   ============================================================
   Núcleo da inteligência do site, conforme item 2.3 do roteiro.
   - Consulta o ViaCEP para resolver cidade/bairro
   - Cruza com a base de unidades pelo prefixo do CEP
   - Persiste o CEP no localStorage para o WhatsApp flutuante
   ============================================================ */

window.LaserCEP = (function() {
  const STORAGE_KEY = 'laserco_cep';

  /* Normaliza o CEP: deixa apenas dígitos */
  function normalize(cep) {
    return String(cep || '').replace(/\D/g, '');
  }

  /* Formata CEP no padrão 00000-000 */
  function format(cep) {
    const n = normalize(cep);
    if (n.length !== 8) return cep;
    return n.slice(0, 5) + '-' + n.slice(5);
  }

  /* Valida CEP — exatamente 8 dígitos */
  function isValid(cep) {
    return normalize(cep).length === 8;
  }

  /* Consulta o ViaCEP. Retorna { cep, cidade, uf, bairro, logradouro } ou null. */
  async function lookup(cep) {
    const n = normalize(cep);
    if (!isValid(n)) return null;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${n}/json/`);
      if (!res.ok) throw new Error('Falha na API ViaCEP');
      const data = await res.json();
      if (data.erro) return null;

      return {
        cep: n,
        cepFormatted: format(n),
        cidade: data.localidade,
        uf: data.uf,
        bairro: data.bairro || '',
        logradouro: data.logradouro || '',
      };
    } catch (e) {
      console.warn('[LaserCEP] Erro ao consultar CEP:', e);
      return null;
    }
  }

  /* Identifica a unidade pelo prefixo do CEP.
     Estratégia: pega os 3 primeiros dígitos do CEP e procura
     uma unidade cuja lista de prefixos contenha esse valor.
     Se não encontrar, faz um fallback por UF.
  */
  function findUnidade(cepData) {
    if (!cepData) return null;
    const unidades = window.LaserData.unidades;
    const prefix3 = cepData.cep.slice(0, 3);

    // 1ª busca: prefixo exato
    let unidade = unidades.find(u => u.cepPrefixos.includes(prefix3));
    if (unidade) return unidade;

    // 2ª busca: por UF (qualquer unidade no estado)
    unidade = unidades.find(u => u.uf === cepData.uf);
    if (unidade) return { ...unidade, _fallback: 'uf' };

    return null;
  }

  /* Persistência local */
  function save(cepData, unidade) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cep: cepData.cep,
        cepFormatted: cepData.cepFormatted,
        cidade: cepData.cidade,
        uf: cepData.uf,
        bairro: cepData.bairro,
        unidadeId: unidade ? unidade.id : null,
        savedAt: Date.now(),
      }));
    } catch (e) {/* localStorage indisponível */}
  }

  function getSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function clearSaved() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* Função-chefe: recebe um CEP, busca, encontra unidade, salva e retorna tudo. */
  async function resolve(cep) {
    const cepData = await lookup(cep);
    if (!cepData) {
      return { success: false, reason: 'invalid', message: 'CEP não encontrado. Confira e tente novamente.' };
    }

    const unidade = findUnidade(cepData);
    save(cepData, unidade);

    if (!unidade) {
      return {
        success: true,
        hasUnidade: false,
        cep: cepData,
        message: 'Ainda estamos chegando à sua cidade — e avisamos quando uma unidade abrir por aí.',
      };
    }

    return {
      success: true,
      hasUnidade: true,
      cep: cepData,
      unidade,
      isFallback: !!unidade._fallback,
    };
  }

  /* Helper para montar a URL do WhatsApp.
     mensagem: string já pronta */
  function whatsappUrl(unidade, mensagem) {
    if (!unidade) return null;
    const phone = unidade.whatsapp;
    const text = encodeURIComponent(mensagem || 'Olá! Vim pelo site da Laser & Co e gostaria de mais informações.');
    return `https://wa.me/${phone}?text=${text}`;
  }

  /* Máscara de CEP para inputs */
  function applyMask(input) {
    if (!input) return;
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 8) v = v.slice(0, 8);
      if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
      e.target.value = v;
    });
  }

  return {
    normalize, format, isValid, lookup, findUnidade,
    save, getSaved, clearSaved, resolve, whatsappUrl, applyMask,
  };
})();
