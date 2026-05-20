/* ============================================================
   PAGE-PAINEL-LOGIN, autenticação de entrada dos painéis
   ============================================================ */

(function () {
  function destinoPorRole(role) {
    return role === 'franqueado' ? 'painel-franqueado.html' : 'painel-franqueador.html';
  }

  function init() {
    // já logado? vai direto para o painel
    const s = window.LaserPainel.getSession();
    if (s && s.user) { location.replace(destinoPorRole(s.user.role)); return; }

    const form = document.getElementById('login-form');
    const erro = document.getElementById('login-erro');
    const btn = document.getElementById('login-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      erro.hidden = true;
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
      if (!email || !senha) { erro.hidden = false; erro.textContent = 'Informe e-mail e senha.'; return; }

      btn.disabled = true;
      const orig = btn.textContent;
      btn.textContent = 'Entrando...';
      try {
        const r = await window.LaserAPI.login(email, senha);
        window.LaserPainel.setSession({ token: r.token, user: r.user });
        location.href = destinoPorRole(r.user.role);
      } catch (err) {
        erro.hidden = false;
        erro.textContent = err && err.code === 'credenciais'
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível entrar. Tente novamente.';
        btn.disabled = false;
        btn.textContent = orig;
      }
    });

    // atalho: clicar num acesso de teste preenche o formulário
    document.querySelectorAll('[data-fill-email]').forEach((el) => {
      el.addEventListener('click', () => {
        document.getElementById('login-email').value = el.dataset.fillEmail;
        document.getElementById('login-senha').value = el.dataset.fillSenha || 'laser2026';
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
