/* =====================================================
   INSI TINTAS — script.js
   Navigation · Filters · WhatsApp form · Reveal effects
   ===================================================== */

(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const WHATSAPP_NUMBER = '244926199669';
  const HEADER_SCROLL_THRESHOLD = 12;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const header = $('#site-header');
  const nav = $('#main-nav');
  const hamburger = $('#hamburger');
  const backToTop = $('#back-to-top');
  const quoteForm = $('#quote-form');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > HEADER_SCROLL_THRESHOLD);
    if (backToTop) backToTop.hidden = window.scrollY < 550;
  }

  function closeMenu() {
    if (!nav || !hamburger) return;
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function openMenu() {
    if (!nav || !hamburger) return;
    nav.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function toggleMenu() {
    if (!nav) return;
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  }

  hamburger?.addEventListener('click', toggleMenu);

  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      $$('.nav-link').forEach((item) => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1100) closeMenu();
  });

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  // Product filters
  const productGrid = $('#product-grid');
  const filterButtons = $$('.filter-btn');

  function ensureEmptyState() {
    if (!productGrid) return null;
    let emptyState = $('.product-empty-state', productGrid);
    if (!emptyState) {
      emptyState = document.createElement('p');
      emptyState.className = 'product-empty-state';
      emptyState.hidden = true;
      emptyState.textContent = 'Nenhum produto encontrado nesta categoria.';
      productGrid.appendChild(emptyState);
    }
    return emptyState;
  }

  function applyProductFilter(filterValue) {
    if (!productGrid) return;

    const cards = $$('.product-card', productGrid);
    let visibleCount = 0;

    cards.forEach((card) => {
      const match = filterValue === 'all' || card.dataset.category === filterValue;
      card.classList.toggle('hidden', !match);
      card.setAttribute('aria-hidden', String(!match));
      if (match) visibleCount += 1;
    });

    const emptyState = ensureEmptyState();
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      applyProductFilter(filter);
    });
  });

  applyProductFilter($('.filter-btn.active')?.dataset.filter || 'all');

  // Quote form to WhatsApp
  function getValue(id) {
    return ($(id)?.value || '').trim();
  }

  function removeFormMessage() {
    $('.form-message', quoteForm)?.remove();
  }

  function showFormMessage(message, type = 'error') {
    if (!quoteForm) return;
    removeFormMessage();
    const element = document.createElement('p');
    element.className = `form-message form-message--${type}`;
    element.setAttribute('role', type === 'error' ? 'alert' : 'status');
    element.textContent = message;
    quoteForm.prepend(element);
  }

  quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    removeFormMessage();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      showFormMessage('Preencha os campos obrigatórios antes de enviar.');
      return;
    }

    const data = {
      nome: getValue('#f-nome'),
      telefone: getValue('#f-telefone'),
      localizacao: getValue('#f-localizacao') || 'Não informado',
      produto: getValue('#f-produto'),
      projeto: getValue('#f-projeto'),
      mensagem: getValue('#f-mensagem') || 'Sem mensagem adicional',
    };

    const message = [
      'Olá INSI Tintas! Quero pedir um orçamento.',
      '',
      `Nome: ${data.nome}`,
      `Telefone: ${data.telefone}`,
      `Localização: ${data.localizacao}`,
      `Produto: ${data.produto}`,
      `Tipo de projeto: ${data.projeto}`,
      `Mensagem: ${data.mensagem}`,
    ].join('\n');

    showFormMessage('A abrir o WhatsApp com o seu pedido...', 'success');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  // Branch map buttons: open a Google Maps search without hardcoding exact GPS.
  $$('.btn-branch-map').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.branch-card');
      const city = $('.branch-city', card)?.textContent.trim() || 'Angola';
      const address = $('.branch-address', card)?.textContent.replace(/\s+/g, ' ').trim() || '';
      const query = `INSI Tintas ${city} ${address}`.trim();
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
    });
  });

  // Back to top
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  // Reveal on scroll
  const revealItems = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach((item) => observer.observe(item));
  }
})();
