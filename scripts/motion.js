/* ============================================================
   MOTION, camada de animações com GSAP + ScrollTrigger + Lenis
   ============================================================
   Carregar DEPOIS de gsap.min.js + ScrollTrigger.min.js + lenis.min.js
   (todos via CDN, ver tag de motion no bottom de cada page).

   Expõe window.LaserMotion com helpers que outras páginas usam.
   Auto-aplica em elementos com data-motion-* / data-counter.
   ============================================================ */
(function() {
  'use strict';

  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- LENIS (smooth scroll global) ---------- */
  let lenis = null;
  function initLenis() {
    if (!hasLenis) return;
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,    // touch nativo é mais responsivo
      wheelMultiplier: 1.05,
      lerp: 0.10,
    });
    document.documentElement.classList.add('lenis-active');

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // sincroniza Lenis com ScrollTrigger
    if (hasGSAP && hasScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // intercepta âncoras pra usar lenis.scrollTo (mantém o offset do header)
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id === '#' || id === '#!' || id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -110, duration: 1.2 });
    });

    window._lenis = lenis;
  }

  /* ---------- HELPERS GSAP ---------- */

  // Counter elegante com easing e formatação brasileira.
  // Uso: <span data-counter="70" data-suffix="+">0</span>
  function setupCounters(root = document) {
    if (!hasGSAP || !hasScrollTrigger) return;
    root.querySelectorAll('[data-counter]').forEach(el => {
      if (el._counted) return;
      el._counted = true;
      const target = parseFloat(el.dataset.counter) || 0;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = parseFloat(el.dataset.duration || '2.8');
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: dur,
            ease: 'expo.out',
            onUpdate: () => {
              const v = decimals > 0
                ? obj.val.toFixed(decimals).replace('.', ',')
                : Math.round(obj.val).toLocaleString('pt-BR');
              el.textContent = prefix + v + suffix;
            },
          });
        },
      });
    });
  }

  // Slide-up + fade-in. Uso: <div class="motion-slide-up">...</div>
  function setupSlideUp(root = document) {
    if (!hasGSAP || !hasScrollTrigger) return;
    root.querySelectorAll('.motion-slide-up').forEach(el => {
      if (el._slid) return;
      el._slid = true;
      gsap.set(el, { y: 60, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' });
        },
      });
    });
  }

  // Stagger nos filhos do container. Uso:
  // <div data-motion-stagger=".step-item">...</div>
  function setupStagger(root = document) {
    if (!hasGSAP || !hasScrollTrigger) return;
    root.querySelectorAll('[data-motion-stagger]').forEach(parent => {
      if (parent._staggered) return;
      parent._staggered = true;
      const sel = parent.dataset.motionStagger || ':scope > *';
      const children = parent.querySelectorAll(sel);
      if (!children.length) return;
      gsap.set(children, { y: 50, opacity: 0 });
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(children, {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.14,
            ease: 'expo.out',
          });
        },
      });
    });
  }

  // Desenha uma linha horizontal.
  // - <div class="motion-draw-line"></div>  ->  scaleX de 0 a 1
  // - <svg class="motion-draw-line">...</svg>  ->  clipPath inset(0 100% 0 0) -> inset(0 0 0 0)
  //   (assim a forma do path SVG não distorce; ele só é revelado).
  function setupDrawLine(root = document) {
    if (!hasGSAP || !hasScrollTrigger) return;
    root.querySelectorAll('.motion-draw-line').forEach(el => {
      if (el._drawn) return;
      el._drawn = true;
      const isSvg = el.tagName && el.tagName.toLowerCase() === 'svg';
      if (isSvg) {
        gsap.set(el, { clipPath: 'inset(0 100% 0 0)', webkitClipPath: 'inset(0 100% 0 0)' });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              clipPath: 'inset(0 0% 0 0)',
              webkitClipPath: 'inset(0 0% 0 0)',
              duration: 1.8,
              ease: 'expo.inOut',
            });
          },
        });
      } else {
        gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(el, { scaleX: 1, duration: 1.8, ease: 'expo.inOut' });
          },
        });
      }
    });
  }

  // Auto-play em vídeos do procedimento dentro do viewport,
  // pausa quando sai (economia de CPU).
  function setupAutoVideos(root = document) {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const v = e.target;
        if (e.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    root.querySelectorAll('video[data-motion-autoplay]').forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      io.observe(v);
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    initLenis();
    setupCounters();
    setupSlideUp();
    setupStagger();
    setupDrawLine();
    setupAutoVideos();
  }

  window.LaserMotion = {
    init, setupCounters, setupSlideUp, setupStagger, setupDrawLine, setupAutoVideos,
    get lenis() { return lenis; },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
