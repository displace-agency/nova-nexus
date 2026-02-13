gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   PAGE TRANSITION — Subtle navy fade
   ═══════════════════════════════════════ */

const pageOverlay = document.querySelector('.page-transition');
if (pageOverlay) {
  gsap.to(pageOverlay, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    delay: 0.05,
    onComplete() { pageOverlay.style.visibility = 'hidden'; },
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    if (href === current) return;
    e.preventDefault();
    pageOverlay.style.visibility = 'visible';
    pageOverlay.style.pointerEvents = 'all';
    gsap.to(pageOverlay, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.in',
      onComplete() { window.location.href = href; },
    });
  });
}


/* ═══════════════════════════════════════
   HERO — Staggered reveal (homepage only)
   ═══════════════════════════════════════ */

const heroHeading = document.querySelector('.hero__heading');
if (heroHeading) {
  heroHeading.innerHTML = heroHeading.textContent.trim().split(/\s+/)
    .map(w => `<span class="word-wrap"><span class="hero-word">${w}</span></span>`)
    .join(' ');

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-word', {
      yPercent: 100,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
    })
    .from('.hero__subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.7,
    }, '-=0.4')
    .from('.hero__buttons .btn', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.12,
    }, '-=0.3')
    .from('.hero__visual img', {
      scale: 0.9,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 1.2,
      ease: 'power2.out',
    }, 0.3);
}


/* ═══════════════════════════════════════
   TECH STACK — Infinite marquee (homepage only)
   ═══════════════════════════════════════ */

const marqueeRow = document.querySelector('.tech-stack__row');
let marqueeTween = null;
let origItems = [];
let resizeTimer;

if (marqueeRow) {
  origItems = [...marqueeRow.querySelectorAll('.tech-stack__item')];

  for (let i = 0; i < 2; i++) {
    origItems.forEach(item => marqueeRow.appendChild(item.cloneNode(true)));
  }

  function initMarquee() {
    if (marqueeTween) marqueeTween.kill();
    const oneSetWidth = origItems.reduce((sum, item) => sum + item.getBoundingClientRect().width, 0);
    gsap.set(marqueeRow, { x: -oneSetWidth });
    marqueeTween = gsap.to(marqueeRow, {
      x: -(oneSetWidth * 2),
      duration: 25,
      ease: 'none',
      repeat: -1,
    });
  }

  initMarquee();
}


/* ═══════════════════════════════════════
   SCROLL REVEAL — Cards stagger up (homepage only)
   ═══════════════════════════════════════ */

const revealSets = [
  { selector: '.pain-point__card',  trigger: '.pain-point__cards' },
  { selector: '.bento-card-2col',   trigger: '.services__bento-top' },
  { selector: '.bento-card-3col',   trigger: '.services__bento-bottom' },
  { selector: '.comparison__card',  trigger: '.comparison__cards' },
  { selector: '.community__card',   trigger: '.community__row' },
];

revealSets.forEach(({ selector, trigger }) => {
  if (!document.querySelector(trigger)) return;
  gsap.from(selector, {
    scrollTrigger: { trigger, start: 'top 80%' },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
  });
});


/* ═══════════════════════════════════════
   APPROACH — Count-up stats (homepage only)
   ═══════════════════════════════════════ */

document.querySelectorAll('.approach__stat-value').forEach(el => {
  const raw = el.textContent.trim();
  const num = parseInt(raw.match(/\d+/)?.[0]);
  if (isNaN(num)) return;
  const suffix = raw.replace(/\d+/, '');

  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter() {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: num,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(counter.val) + suffix;
        },
      });
    },
  });
});


/* ═══════════════════════════════════════
   PROCESS — Auto-scrolling marquee (homepage only)
   ═══════════════════════════════════════ */

const processCardsContainer = document.querySelector('.process__cards');
let processTween = null;

if (processCardsContainer) {
  const origProcessCards = [...processCardsContainer.querySelectorAll('.process__card')];

  for (let i = 0; i < 2; i++) {
    origProcessCards.forEach(card => processCardsContainer.appendChild(card.cloneNode(true)));
  }

  function initProcessMarquee() {
    if (processTween) processTween.kill();
    const gap = parseFloat(window.getComputedStyle(processCardsContainer).gap) || 14;
    const oneSetWidth = origProcessCards.reduce((sum, card) => {
      return sum + card.getBoundingClientRect().width + gap;
    }, 0);
    gsap.set(processCardsContainer, { x: 0 });
    processTween = gsap.to(processCardsContainer, {
      x: -oneSetWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });
  }

  initProcessMarquee();
}

// Recalculate marquees on resize (debounced)
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (typeof initMarquee === 'function') initMarquee();
    if (typeof initProcessMarquee === 'function') initProcessMarquee();
  }, 250);
});


/* ═══════════════════════════════════════
   FAQ — Accordion (homepage only)
   ═══════════════════════════════════════ */

document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__question').addEventListener('click', () => {
    const isActive = item.classList.contains('faq__item--active');

    document.querySelectorAll('.faq__item').forEach(other => {
      other.classList.remove('faq__item--active');
      other.classList.add('faq__item--default');
      gsap.to(other.querySelector('.faq__plus'), {
        rotation: 0, duration: 0.3, ease: 'power2.inOut',
      });
      const otherAnswer = other.querySelector('.faq__answer');
      if (otherAnswer) {
        gsap.to(otherAnswer, {
          height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut',
        });
      }
    });

    if (!isActive) {
      item.classList.remove('faq__item--default');
      item.classList.add('faq__item--active');
      gsap.to(item.querySelector('.faq__plus'), {
        rotation: 45, duration: 0.3, ease: 'power2.inOut',
      });
      const answer = item.querySelector('.faq__answer');
      if (answer) {
        gsap.to(answer, {
          height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out',
        });
      }
    }
  });
});


/* ═══════════════════════════════════════
   CONTACT HERO — Staggered reveal (contact page)
   ═══════════════════════════════════════ */

const contactHero = document.querySelector('.contact-hero');
if (contactHero) {
  const contactTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  contactTl
    .from('.contact-hero__heading', {
      y: 40,
      opacity: 0,
      duration: 0.9,
    })
    .from('.contact-hero__subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.7,
    }, '-=0.4')
    .from('.contact-hero__buttons .btn', {
      y: 20,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from('.contact-hero__visual', {
      scale: 0.9,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 1.2,
      ease: 'power2.out',
    }, 0.3);
}


/* ═══════════════════════════════════════
   CONTACT FORM — Scroll-triggered reveal (contact page)
   ═══════════════════════════════════════ */

const contactForm = document.querySelector('.contact-form-section');
if (contactForm) {
  gsap.from('.contact-form-section__title', {
    scrollTrigger: { trigger: '.contact-form-section', start: 'top 80%' },
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  });

  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact-form', start: 'top 85%' },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  });

  gsap.from('.contact-form__field, .contact-form__row', {
    scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
  });

  gsap.from('.contact-form__submit', {
    scrollTrigger: { trigger: '.contact-form__submit', start: 'top 95%' },
    y: 15,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  });
}


/* ═══════════════════════════════════════
   CTA — Scroll-triggered reveal (all pages)
   ═══════════════════════════════════════ */

const ctaSection = document.querySelector('.cta');
if (ctaSection) {
  gsap.from('.cta .h2', {
    scrollTrigger: { trigger: '.cta', start: 'top 80%' },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  });

  gsap.from('.cta__subtitle', {
    scrollTrigger: { trigger: '.cta__block', start: 'top 85%' },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: 'power2.out',
  });

  gsap.from('.cta__buttons .btn', {
    scrollTrigger: { trigger: '.cta__buttons', start: 'top 90%' },
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
  });

  const ctaPartner = document.querySelector('.cta__partner');
  if (ctaPartner) {
    gsap.from(ctaPartner, {
      scrollTrigger: { trigger: ctaPartner, start: 'top 90%' },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }
}


/* ═══════════════════════════════════════
   FOOTER — Scroll-triggered reveal (all pages)
   ═══════════════════════════════════════ */

const footer = document.querySelector('.footer');
if (footer) {
  gsap.from('.footer__brand-name', {
    scrollTrigger: { trigger: '.footer', start: 'top 85%' },
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
  });

  gsap.from('.footer__brand-desc', {
    scrollTrigger: { trigger: '.footer', start: 'top 85%' },
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 0.15,
    ease: 'power2.out',
  });

  gsap.from('.footer__nav-col', {
    scrollTrigger: { trigger: '.footer__nav', start: 'top 90%' },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
  });

  gsap.from('.footer__bottom', {
    scrollTrigger: { trigger: '.footer__bottom', start: 'top 95%' },
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
  });

  // Orbs — subtle scale-in
  gsap.from('.footer__orb', {
    scrollTrigger: { trigger: '.footer', start: 'top 80%' },
    scale: 0.5,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power2.out',
  });

  // Logo decoration — fade & drift in
  const logoDecor = document.querySelector('.footer__logo-decoration');
  if (logoDecor) {
    gsap.from(logoDecor, {
      scrollTrigger: { trigger: '.footer', start: 'top 80%' },
      y: -20,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });
  }
}
