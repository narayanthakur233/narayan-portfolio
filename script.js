document.addEventListener('DOMContentLoaded', () => {

  const navLinks   = document.querySelectorAll('.nav-link');
  const panels      = document.querySelectorAll('.panel');
  const menuToggle  = document.getElementById('menuToggle');
  const navList     = document.getElementById('navList');
  const yearEl      = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function activateTab(tabId, updateHash = true) {
    navLinks.forEach(link => {
      const isMatch = link.dataset.tab === tabId;
      link.classList.toggle('is-active', isMatch);
      link.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    panels.forEach(panel => {
      panel.classList.toggle('is-active', panel.id === tabId);
    });

    // scroll stage back to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash) {
      history.replaceState(null, '', `#${tabId}`);
    }

    // close mobile nav after selection
    navList.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => activateTab(link.dataset.tab));
  });

  // buttons that jump to a tab (e.g. "Contact me" on Home)
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.goto));
  });

  // mobile hamburger
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // deep-link support: narayanthakur.in/#experience opens straight to that tab
  const initial = window.location.hash.replace('#', '');
  const validTabs = Array.from(navLinks).map(l => l.dataset.tab);
  if (initial && validTabs.includes(initial)) {
    activateTab(initial, false);
  }

  // ===== dark / light theme toggle =====
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('nt-theme', 'dark'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem('nt-theme', 'light'); } catch (e) {}
      }
    });
  }

  // ===== typewriter helper, reused for hero tagline + CLI cycler =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeLoop(el, phrases, opts = {}) {
    if (!el || !phrases.length) return;
    const typeSpeed   = opts.typeSpeed   || 45;
    const deleteSpeed = opts.deleteSpeed || 25;
    const holdTime    = opts.holdTime    || 1800;
    const gapTime     = opts.gapTime     || 400;

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, holdTime);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, gapTime);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }
    tick();
  }

  typeLoop(document.getElementById('typedText'), [
    'I design secure networks.',
    'I build VPN solutions.',
    'I troubleshoot critical incidents.',
    'I automate infrastructure operations.'
  ]);

  typeLoop(document.getElementById('cliCycler'), [
    'ntadmin@core-rtr01: ~$ show system status',
    'ntadmin@core-rtr01: ~$ get vpn ipsec tunnel summary — Tunnel Status: UP',
    'ntadmin@core-rtr01: ~$ get system performance status — CPU: 12% | Mem: 48%',
    'ntadmin@core-rtr01: ~$ get router info bgp summary — Peers Established: 5'
  ], { typeSpeed: 30, deleteSpeed: 15, holdTime: 2200 });

  // ===== animated stat counters (count up when scrolled into view) =====
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target || '0');
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        if (prefersReducedMotion) {
          el.textContent = target.toFixed(decimals) + suffix;
        } else {
          requestAnimationFrame(step);
        }
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  // ===== hero particle network background =====
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let particles = [];
    let width = 0, height = 0, rafId = null;

    function accentColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4FD1C5';
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(46, Math.max(18, Math.round((width * height) / 18000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const color = accentColor();
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 120) * 0.35;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.8;
      particles.forEach(p => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }

    function start() {
      if (rafId) return;
      draw();
    }
    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });
  }
});
