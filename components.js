/* ══════════════════════════════════════════════
   Nova Nexus — Web Components
   Reusable, stamp-out components.
   Load BEFORE scripts.js so expanded DOM is ready for GSAP.
   ══════════════════════════════════════════════ */

const ARROW_SVG = '<svg class="arrow-icon" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';


/* ── <nova-btn variant="primary">Text</nova-btn> ──
   Variants: primary, white, dark, cta-white, light, link, white-blue
   Optional: href (renders <a> instead of <button>)
   ──────────────────────────────────────────────── */
class NovaBtn extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const text = this.textContent.trim();
    const href = this.getAttribute('href');
    const tag = href ? 'a' : 'button';

    const el = document.createElement(tag);
    el.className = `btn btn--${variant}`;
    if (href) el.setAttribute('href', href);

    if (variant === 'link') {
      el.innerHTML = `<span>${text}</span>${ARROW_SVG}`;
    } else {
      el.innerHTML = `<span>${text}</span><span class="btn__icon">${ARROW_SVG}</span>`;
    }

    this.replaceWith(el);
  }
}
customElements.define('nova-btn', NovaBtn);


/* ── <nova-tag [variant="blue"] [center]>Text</nova-tag> ──
   Renders section tag with /prefix.
   ──────────────────────────────────────────────── */
class NovaTag extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || '';
    const isCenter = this.hasAttribute('center');
    const text = this.textContent.trim();

    const div = document.createElement('div');
    let cls = 'section-tag';
    if (variant === 'blue') cls += ' section-tag--blue';
    if (isCenter) cls += ' section-tag--center';
    div.className = cls;

    const span = document.createElement('span');
    if (variant === 'blue') span.className = 'section-tag__text section-tag__text--blue';
    span.textContent = '/' + text;

    div.appendChild(span);
    this.replaceWith(div);
  }
}
customElements.define('nova-tag', NovaTag);


/* ── <nova-faq question="...">Answer text</nova-faq> ──
   Expands to .faq__item with question button + answer div.
   Accordion behavior handled by scripts.js.
   ──────────────────────────────────────────────── */
class NovaFaq extends HTMLElement {
  connectedCallback() {
    const question = this.getAttribute('question');
    const answer = this.textContent.trim();

    const div = document.createElement('div');
    div.className = 'faq__item faq__item--default';
    div.innerHTML = `
      <button class="faq__question">
        <span class="faq__question-text">${question}</span>
        <span class="faq__plus"></span>
      </button>
      <div class="faq__answer">
        <p>${answer}</p>
      </div>
    `;
    this.replaceWith(div);
  }
}
customElements.define('nova-faq', NovaFaq);


/* ── <nova-navbar></nova-navbar> ──
   Shared navigation across all pages.
   ──────────────────────────────────────────────── */
class NovaNavbar extends HTMLElement {
  connectedCallback() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo">
          <img src="images/logo.svg" alt="Nova Nexus" width="146" height="32">
        </a>
        <div class="navbar__links">
          <a href="index.html" class="navbar__link">About Us</a>
          <a href="#" class="navbar__link">Solutions</a>
          <a href="contact.html" class="navbar__link">Contact</a>
        </div>
      </div>
    `;
    this.replaceWith(nav);
  }
}
customElements.define('nova-navbar', NovaNavbar);


/* ── <nova-footer></nova-footer> ──
   Shared footer across all pages.
   ──────────────────────────────────────────────── */
class NovaFooter extends HTMLElement {
  connectedCallback() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="footer__orb footer__orb--blue"></div>
      <div class="footer__orb footer__orb--light"></div>
      <div class="footer__inner">
        <div class="footer__logo-decoration" aria-hidden="true">
          <img src="images/hero-nexus.png" alt="">
        </div>
        <div class="footer__brand">
          <h2 class="footer__brand-name">Nova Nexus</h2>
          <p class="footer__brand-desc">Conectamos industrias estratégicas con la mejor tecnología del mundo.</p>
        </div>
        <nav class="footer__nav">
          <div class="footer__nav-col">
            <span class="footer__nav-label">/NAVIGATION</span>
            <div class="footer__nav-links">
              <a href="index.html">Home</a>
              <a href="#">Nosotros</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div class="footer__nav-col">
            <span class="footer__nav-label">/LEGAL</span>
            <div class="footer__nav-links">
              <a href="#">Terms of Services</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
          <div class="footer__nav-col">
            <span class="footer__nav-label">/CONTACT</span>
            <div class="footer__nav-links">
              <a href="mailto:contacto@novanexus.cl">contacto@novanexus.cl</a>
              <a href="#">Santiago, Chile</a>
            </div>
          </div>
          <div class="footer__nav-col">
            <span class="footer__nav-label">/FOLLOW US</span>
            <div class="footer__nav-links">
              <a href="#">X/Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </nav>
        <div class="footer__bottom">
          <span class="footer__copyright">@2026 NOVA NEXUS. All Rights Reserved. • Privacy Policy • Terms of Service</span>
        </div>
      </div>
    `;
    this.replaceWith(footer);
  }
}
customElements.define('nova-footer', NovaFooter);
