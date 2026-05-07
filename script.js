/* ════════════════════════════════════════════════
   INSI TINTAS LDA — script.js
════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   NAV: scroll shadow + hamburger menu
────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// close on outside click
document.addEventListener('click', e => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ──────────────────────────────────────
   BACK TO TOP
────────────────────────────────────── */
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ──────────────────────────────────────
   PRODUCT FILTER TABS
────────────────────────────────────── */
const filterTabs  = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.produto-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // update active tab
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const cat = tab.dataset.filter;

    productCards.forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
        // micro-animation on reveal
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ──────────────────────────────────────
   SCROLL ANIMATIONS (IntersectionObserver)
────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ──────────────────────────────────────
   ACTIVE NAV LINK (scroll spy)
────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => spyObserver.observe(s));

/* ──────────────────────────────────────
   IMAGE PLACEHOLDER FALLBACK
────────────────────────────────────── */
document.querySelectorAll('img[data-src-fallback]').forEach(img => {
  img.addEventListener('error', function () {
    const fallback = this.dataset.srcFallback;
    if (fallback) this.src = fallback;
  });
});

/* ──────────────────────────────────────
   WHATSAPP FORM
────────────────────────────────────── */
const WA_NUMBER = '244926199669';

const orcForm = document.getElementById('orcamentoForm');
if (orcForm) {
  orcForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome      = this.querySelector('[name="nome"]').value.trim();
    const telefone  = this.querySelector('[name="telefone"]').value.trim();
    const local     = this.querySelector('[name="local"]').value.trim();
    const produto   = this.querySelector('[name="produto"]').value;
    const projeto   = this.querySelector('[name="projeto"]').value;
    const mensagem  = this.querySelector('[name="mensagem"]').value.trim();

    if (!nome || !telefone) {
      alert('Por favor, preencha pelo menos o nome e o telefone.');
      return;
    }

    const msg = [
      '🎨 *Olá INSI Tintas! Quero pedir um orçamento.*',
      '',
      `*Nome:* ${nome}`,
      `*Telefone:* ${telefone}`,
      `*Localização:* ${local || 'Não indicado'}`,
      `*Produto:* ${produto || 'Não indicado'}`,
      `*Tipo de projeto:* ${projeto || 'Não indicado'}`,
      mensagem ? `*Mensagem:* ${mensagem}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

/* ──────────────────────────────────────
   INDIVIDUAL PRODUCT "PEDIR" BUTTONS
────────────────────────────────────── */
document.querySelectorAll('.btn-pedir').forEach(btn => {
  btn.addEventListener('click', () => {
    const produto = btn.dataset.produto || 'Produto INSI';
    const msg = `Olá INSI Tintas! Tenho interesse no seguinte produto: *${produto}*. Podem fornecer mais informações e orçamento?`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
});

/* ──────────────────────────────────────
   GENERIC WA CTA BUTTONS
────────────────────────────────────── */
document.querySelectorAll('[data-wa-msg]').forEach(el => {
  el.addEventListener('click', () => {
    const msg = el.dataset.waMsg || 'Olá INSI Tintas! Gostaria de mais informações.';
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
});

/* ──────────────────────────────────────
   SMOOTH SCROLL for anchor links
────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});