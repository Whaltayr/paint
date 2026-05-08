/* =====================================================
   INSI TINTAS — script.js
   Vanilla JS · Acessível · Sem dependências
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     UTILITÁRIOS
     ===================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* =====================================================
     1. MENU MOBILE (hamburger)
     ===================================================== */
  const hamburger = $('#hamburger');
  const mainNav   = $('#main-nav');

  function openMenu() {
    mainNav.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
    document.body.style.overflow = 'hidden';
    // foco no primeiro link
    const firstLink = $('a, button', mainNav);
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    mainNav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.style.overflow = '';
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Fechar ao clicar num link
    $$('.nav-link', mainNav).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Fechar com ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* =====================================================
     2. HEADER — sombra ao fazer scroll
     ===================================================== */
  const siteHeader = $('#site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  if (siteHeader) {
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // estado inicial
  }

  /* =====================================================
     3. BOTÃO VOLTAR AO TOPO
     ===================================================== */
  const backToTopBtn = $('#back-to-top');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.hidden = false;
    } else {
      backToTopBtn.hidden = true;
    }
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    handleBackToTop();
  }

  /* =====================================================
     4. ANIMAÇÕES AO SCROLL — IntersectionObserver
     ===================================================== */
  const revealEls = $$('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     5. FILTROS DE PRODUTOS (tabs)
     ===================================================== */
  const filterBtns  = $$('.filter-btn');
  const productCards = $$('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Atualizar botões
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filtrar cards com animação suave
      productCards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-acionar animação
          card.classList.remove('is-visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('is-visible'));
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* =====================================================
     6. FORMULÁRIO DE ORÇAMENTO → WhatsApp
     ===================================================== */
  const quoteForm    = $('#quote-form');
  const WA_NUMBER    = '244926199669'; // ← Altere aqui o número WhatsApp

  if (quoteForm) {
    quoteForm.addEventListener('submit', e => {
      e.preventDefault();

      // Validação simples
      const requiredFields = $$('[required]', quoteForm);
      let valid = true;

      requiredFields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#E50914';
          field.focus();
          valid = false;
        }
      });

      if (!valid) {
        // Scroll para o primeiro campo inválido
        const firstInvalid = $('[required]', quoteForm);
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Recolher dados
      const nome       = $('#f-nome').value.trim();
      const telefone   = $('#f-telefone').value.trim();
      const localizacao = $('#f-localizacao').value.trim() || 'Não indicada';
      const produto    = $('#f-produto').value;
      const projeto    = $('#f-projeto').value;
      const mensagem   = $('#f-mensagem').value.trim() || 'Sem mensagem adicional.';

      // Montar mensagem
      const msg = [
        '🖌️ *Olá INSI Tintas! Quero pedir um orçamento.*',
        '',
        `*Nome:* ${nome}`,
        `*Telefone:* ${telefone}`,
        `*Localização:* ${localizacao}`,
        `*Produto:* ${produto}`,
        `*Tipo de projeto:* ${projeto}`,
        `*Mensagem:* ${mensagem}`,
      ].join('\n');

      const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waURL, '_blank', 'noopener,noreferrer');

      // Feedback visual
      const submitBtn = $('[type="submit"]', quoteForm);
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ A abrir WhatsApp...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        quoteForm.reset();
      }, 3000);
    });

    // Limpar erro ao digitar
    $$('[required]', quoteForm).forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  /* =====================================================
     7. BOTÕES "Ver localização" das filiais
        (placeholder — ligar ao Google Maps quando tiver coords)
     ===================================================== */
  const BRANCH_MAPS = {
    'Namibe':  'https://maps.google.com/?q=Namibe,Angola',
    'Lubango': 'https://maps.google.com/?q=Lubango,Angola',
    'Huambo':  'https://maps.google.com/?q=Huambo,Angola',
    'Luanda':  'https://maps.google.com/?q=Luanda,Angola',
  };

  $$('.btn-branch-map').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.branch-card');
      const cityEl = card ? $('.branch-city', card) : null;
      const city = cityEl ? cityEl.textContent.trim() : null;
      const url  = BRANCH_MAPS[city] || 'https://maps.google.com/?q=Angola';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  /* =====================================================
     8. SMOOTH SCROLL para links internos
     ===================================================== */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Acessibilidade: mover foco para a secção
      if (!target.getAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });

  /* =====================================================
     9. LAZY LOADING de imagens (fallback nativo)
     ===================================================== */
  $$('img').forEach(img => {
    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  /* =====================================================
     10. ACTIVE NAV LINK ao scroll (Intersection Observer)
     ===================================================== */
  const sections = $$('section[id], main[id]');
  const navLinks = $$('.nav-link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              link.style.color = '';
              link.style.borderBottomColor = '';

              if (href === `#${id}`) {
                link.style.color = 'var(--red)';
              }
            });
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
      }
    );

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* =====================================================
     LOG DE INICIALIZAÇÃO (remover em produção)
     ===================================================== */
  console.info('%c✦ INSI Tintas · Site carregado com sucesso', 'color:#E50914;font-weight:bold;');

})();