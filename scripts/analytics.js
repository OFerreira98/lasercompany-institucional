/* ============================================================
   ANALYTICS — Captura de leads e eventos
   ============================================================
   Em produção, integrar com:
   - Painel do Franqueador (relatórios de leads)
   - Painel do Franqueado (filtros por unidade)
   - GA4 / Pixel / outras tags
   ============================================================ */

window.LaserAnalytics = (function() {
  const STORAGE_LEADS = 'laserco_leads';
  const STORAGE_EVENTS = 'laserco_events';

  /* Tipos de lead conforme o roteiro:
     - popup: Conversão A (lead geral via popup)
     - agendamento: Conversão B (agendamento via WhatsApp)
     - agendamento_interesse: Etapa 2 concluída mesmo sem clique no WhatsApp
     - recrutamento: Conversão C (candidatura a vaga)
     - franquia: Lead da página Seja um Franqueado
     - chatbot: Lead captado via chatbot
     - contato: Formulário institucional
  */
  function trackLead(tipo, dados) {
    const lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      tipo,
      dados,
      origem: getTrafficSource(),
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    const all = getLeads();
    all.unshift(lead);
    try { localStorage.setItem(STORAGE_LEADS, JSON.stringify(all.slice(0, 200))); } catch(e) {}

    // Em produção: POST /api/leads { tipo, dados, origem, url, timestamp }
    console.info('[LaserAnalytics] Lead registrado:', lead);

    // Dispara evento global para que o site possa reagir (ex: mostrar toast)
    window.dispatchEvent(new CustomEvent('laser:lead', { detail: lead }));

    return lead;
  }

  function getLeads() {
    try {
      const raw = localStorage.getItem(STORAGE_LEADS);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function trackEvent(name, data) {
    const ev = {
      name,
      data: data || {},
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    const all = getEvents();
    all.unshift(ev);
    try { localStorage.setItem(STORAGE_EVENTS, JSON.stringify(all.slice(0, 200))); } catch(e) {}

    console.info('[LaserAnalytics] Evento:', name, data || '');
  }

  function getEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_EVENTS);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function getTrafficSource() {
    try {
      const ref = document.referrer;
      const params = new URLSearchParams(window.location.search);
      const utm = params.get('utm_source');

      if (utm) return utm;
      if (!ref) return 'direto';
      try {
        const refHost = new URL(ref).hostname;
        if (refHost.includes('google')) return 'google';
        if (refHost.includes('facebook') || refHost.includes('fb')) return 'facebook';
        if (refHost.includes('instagram')) return 'instagram';
        if (refHost.includes('tiktok')) return 'tiktok';
        if (refHost.includes('youtube')) return 'youtube';
        return refHost;
      } catch(e) { return 'direto'; }
    } catch(e) { return 'desconhecido'; }
  }

  return {
    trackLead, trackEvent, getLeads, getEvents, getTrafficSource,
  };
})();
