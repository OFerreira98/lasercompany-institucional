/* ============================================================
   MAIN, Orquestração global
   ============================================================
   - Header sticky com encolhimento
   - Menu mobile toggle
   - Reveal on scroll (Intersection Observer)
   - Marca link ativo no menu
   - Toast helper
   ============================================================ */

window.LaserUI = (function() {

  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Toggle mobile
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.header-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
    }

    // Submenu mobile click toggle
    header.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      const submenu = item.querySelector('.nav-submenu');
      if (!submenu) return;
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 980) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    });

    // Marca link ativo
    const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    header.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === path) link.classList.add('active');
    });
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    // expõe global pra que renderizadores dinâmicos (blog rotativo, etc)
    // possam registrar novos elementos depois.
    window._revealObs = io;
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function toast(message, type) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (type ? ' toast-' + type : '');
    t.innerHTML = message;
    container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => {
      t.classList.remove('visible');
      setTimeout(() => t.remove(), 400);
    }, 4500);
  }

  function applyMasks() {
    // Máscara para todos os inputs com data-mask
    document.querySelectorAll('input[data-mask="phone"]').forEach(input => {
      input.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length > 0) v = `(${v}`;
        e.target.value = v;
      });
    });
    document.querySelectorAll('input[data-mask="cep"]').forEach(input => {
      window.LaserCEP.applyMask(input);
    });
  }

  function init() {
    initHeader();
    initReveal();
    initSmoothAnchors();
    applyMasks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { toast };
})();
