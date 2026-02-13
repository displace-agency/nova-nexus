# Nova Nexus — Marketing Website

A static marketing website for Nova Nexus, a technology consulting company connecting Latin American industries with global tech solutions. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

## Pages

- **`index.html`** — Homepage with hero, tech stack marquee, pain points, services bento grid, approach/case study, process cards, comparison table, community events, FAQ accordion, and CTA
- **`contact.html`** — Contact page with hero, contact form, and shared CTA

## Architecture

### Web Components (`components.js`)

Reusable elements using the Custom Elements API with a stamp-out pattern (`replaceWith()`). No Shadow DOM — existing BEM CSS applies directly to expanded elements. Must load **before** `scripts.js` so the expanded DOM is ready for GSAP.

| Component | Usage | Description |
|-----------|-------|-------------|
| `<nova-btn>` | `<nova-btn variant="primary">Text</nova-btn>` | Button with arrow icon. Variants: `primary`, `white`, `dark`, `cta-white`, `light`, `link`, `white-blue` |
| `<nova-tag>` | `<nova-tag variant="blue" center>Text</nova-tag>` | Section label with `/prefix` |
| `<nova-faq>` | `<nova-faq question="...">Answer</nova-faq>` | Accordion item (behavior in scripts.js) |
| `<nova-navbar>` | `<nova-navbar></nova-navbar>` | Shared navigation bar |
| `<nova-footer>` | `<nova-footer></nova-footer>` | Shared footer with brand mark, nav columns, orbs, copyright |

### Styling (`styles.css`)

Single stylesheet using BEM naming convention and CSS custom properties:

```
--navy: #0F112A       (dark backgrounds)
--blue: #2B40F5       (primary accent)
--lavender: #E4E6F3   (light text on dark)
--white: #FFFFFF
--gray: #E5E5E5       (secondary text)
--max-w: 1240px       (content width cap)
--section-pad: 80px   (vertical rhythm)
```

**Responsive breakpoints:**
- `> 1024px` — Desktop (design baseline at 1440px)
- `<= 1024px` — Tablet (stacked hero, 2-up card grids)
- `<= 768px` — Mobile (single column, smaller type)
- `<= 480px` — Small mobile (compact spacing, stacked stats)

**FOUC prevention:** `:not(:defined)` rules hide web components until they upgrade.

### Animations (`scripts.js`)

GSAP 3.12.5 + ScrollTrigger for all animations. The script uses existence guards so it runs safely on both pages.

**Homepage-only animations:**
- Hero word-by-word stagger reveal
- Tech stack infinite marquee (resize-aware, debounced recalculation)
- Scroll-triggered card reveals (pain points, services, comparison, community)
- Approach stat count-up on scroll
- Process cards infinite marquee
- FAQ accordion with GSAP-powered open/close

**Contact page animations:**
- Contact hero heading, subtitle, button, and visual staggered reveal
- Form section scroll reveal with staggered field entries

**Global animations (both pages):**
- CTA section: heading, subtitle, buttons, and partner section fade-up
- Footer: brand name/desc, nav columns stagger, copyright, orbs scale-in, logo decoration drift-in

### Fonts

Loaded from Google Fonts:
- **Albert Sans** (400, 500, 600, 700) — Primary headings and body
- **Inter** (400, 500) — UI elements
- **Roboto Mono** (400) — Monospaced accents (stat labels)

## File Structure

```
nova-nexus/
├── index.html          Homepage
├── contact.html        Contact page
├── styles.css          All styles (base + responsive)
├── components.js       Web Components (loads first)
├── scripts.js          GSAP animations (loads after components)
├── images/             All image assets
│   ├── logo.svg        Nova Nexus logo (wordmark + brand mark)
│   ├── hero-nexus.png  Homepage hero visual
│   ├── hero-contact.png Contact hero visual
│   ├── pain-point-*.png Pain point backgrounds and orbs
│   ├── Content_*.png   Community event cards
│   ├── Logo_*.png      Tech stack partner logos
│   └── ...             Service cards, approach images
└── README.md           This file
```

## Script Loading Order

```html
<script src="components.js"></script>               <!-- 1. Expand web components -->
<script src="gsap.min.js"></script>                  <!-- 2. GSAP core -->
<script src="ScrollTrigger.min.js"></script>          <!-- 3. ScrollTrigger plugin -->
<script src="scripts.js"></script>                    <!-- 4. All animations -->
```

## Development

No build step required. Serve with any static file server:

```bash
python3 -m http.server 8000
# or
npx serve .
```

## What Was Built

### Homepage (`index.html`)
- Full-page marketing layout from Figma export
- 10 sections: navbar, hero, tech stack, pain points, services, approach, process, comparison, community, FAQ, CTA, footer
- All sections fluid within a 1240px max-width container
- Infinite marquee animations for tech stack and process cards
- FAQ accordion with GSAP transitions
- Scroll-triggered reveals throughout

### Contact Page (`contact.html`)
- Contact hero with gradient background matching Figma specs exactly
- Form section with labeled inputs, selects, and textarea
- Shared CTA and footer components (identical to homepage)

### Component System
- Migrated repeated elements (buttons, tags, FAQ items, navbar, footer) to Web Components
- Stamp-out pattern — components expand to standard DOM at load, no runtime overhead
- FOUC prevention with `:not(:defined)` CSS
- Footer includes decorative brand mark SVG and animated gradient orbs

### Responsive Design
- Progressive responsive overhaul across 4 breakpoints
- All inner containers fluid (`width: 100%` with `max-width`)
- Hardcoded pixel widths converted to flex/max-width patterns
- Contact page hero, form, and visual scale properly at all viewports

### Animation System
- Unified GSAP animation approach across both pages
- Homepage-specific animations guarded with existence checks
- Global CTA and footer animations shared via single `scripts.js`
- Resize-aware marquee recalculation (debounced 250ms)
