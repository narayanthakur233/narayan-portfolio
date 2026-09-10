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

  // ===== job history modal (terminal popup) =====
  const jobRows      = document.querySelectorAll('.job-row');
  const modalOverlay = document.getElementById('jobModalOverlay');
  const modalBody     = document.getElementById('jobModalBody');
  const modalPath     = document.getElementById('jobModalPath');
  const modalClose    = document.getElementById('jobModalClose');

  function openJobModal(row) {
    const tpl = document.getElementById(row.dataset.modal);
    if (!tpl) return;
    modalBody.innerHTML = '';
    modalBody.appendChild(tpl.content.cloneNode(true));
    modalPath.textContent = row.dataset.path || 'ntadmin@core-rtr01: ~$';
    modalOverlay.classList.add('is-open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeJobModal() {
    modalOverlay.classList.remove('is-open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  jobRows.forEach(row => {
    row.addEventListener('click', () => openJobModal(row));
  });

  if (modalClose) modalClose.addEventListener('click', closeJobModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeJobModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeJobModal();
    }
  });

  // deep-link support: narayanthakur.in/#experience opens straight to that tab
  const initial = window.location.hash.replace('#', '');
  const validTabs = Array.from(navLinks).map(l => l.dataset.tab);
  if (initial && validTabs.includes(initial)) {
    activateTab(initial, false);
  }
});
