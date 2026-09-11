# Farm Brain — Responsive Website (Recreation)

A pixel-faithful, fully responsive recreation of **https://www.farmbrain.in**, built from
scratch with **semantic HTML5, maintainable CSS, and dependency-free vanilla JavaScript**.

No frameworks, no build step — just open it in a browser.

---

## 🚀 How to run

**Option A — double-click**
Open `index.html` in any modern browser.

**Option B — local server** (recommended, so fonts/relative paths behave exactly like production)

```bash
# from inside the FarmBrain-Website folder
python -m http.server 8777
# then visit http://localhost:8777
```

---

## 📁 Project structure

```
FarmBrain-Website/
├── index.html          # Semantic markup for every section
├── css/
│   └── styles.css      # Design tokens + all component & responsive styles
├── js/
│   └── main.js         # Interactions (no libraries)
├── assets/
│   └── favicon.svg     # Brand mark
└── README.md
```

The CSS is organised with a numbered table of contents (tokens → base → utilities →
components → responsive) so any section is easy to find and maintain.

---

## ✨ What's included

**Sections:** sticky nav · hero · core capabilities (6-card grid) · platform/dashboard
mockup · solutions (tabbed) · about · animated stats · 4-step process · pricing · FAQ
accordion · contact form · footer · cookie-consent banner.

**Interactions (vanilla JS):**
- Responsive **hamburger menu** with focus/Escape handling
- Accessible **tabs** (ARIA roles + arrow-key navigation) for Solutions
- Single-open **FAQ accordion** with animated height
- **Scroll-reveal** animations via `IntersectionObserver` (staggered)
- **Count-up** number animations for the stats
- **Live sensor** ticker that gently varies readings (units preserved)
- **Form validation** (name + email) with inline error states and a simulated async submit
- **Cookie banner** that remembers the choice in `localStorage` (re-openable from the footer)

**Accessibility & polish:** skip link, visible focus rings, ARIA attributes,
`prefers-reduced-motion` support, and theme-color meta.

---

## 🧩 Notes on the four skill areas

**1. Markup & styling (HTML / CSS / SCSS)**
Semantic HTML throughout (`header`, `nav`, `main`, `section`, `article`, `form`, `footer`).
CSS uses a **design-token system** via custom properties (colours, typography, radii,
shadows, easing) — the same idea SCSS variables give you, but native. A **BEM-style**
naming convention (`.feature-card__icon`, `.nav__toggle`) keeps it readable and scalable.
This can be dropped into a Sass pipeline unchanged if desired.

**2. Responsive web design**
Mobile-first fluid design with `clamp()` for type/spacing, CSS Grid + Flexbox, and three
tuned breakpoints (`1024px`, `860px`, `560px`). Multi-column grids collapse to single
column, the nav becomes a hamburger drawer, decorative floating cards hide on small
screens, and there is **zero horizontal overflow** at 375px.

**3. Translating design specs**
The layout, colour palette, typography (Inter / Sora / JetBrains Mono), spacing scale, and
component structure were reproduced faithfully from the reference site — the kind of
translation you'd do from a Figma/XD/PSD file.

**4. Interactive UI & dynamics (JavaScript)**
Preferred approach here is **vanilla JS** — it keeps this marketing site fast and
zero-dependency. For larger apps I'd reach for a framework (React/Vue) or a small library
(e.g. Swiper for carousels, GSAP + ScrollTrigger for complex scroll timelines), but every
interaction on this site (menu, tabs, accordion, scroll reveals, counters, form) is
hand-written and framework-free.

---

*Built as an independent front-end recreation for demonstration/learning. All Farm Brain
branding and product copy belong to their respective owner.*
