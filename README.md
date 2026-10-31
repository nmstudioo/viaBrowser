# Via Browser — Optimization Guide

A precision field guide to mastering **ad-blocking, WebView speed flags and privacy settings** in [Via Browser](https://play.google.com/store/search?q=via%20browser) on Android. Six parts, no root, no developer background — 10–15 minutes end to end.

Built as a dependency-free static page: semantic HTML, a tokenized design system, and a small modular JavaScript layer. Deployed with GitHub Pages.

> **Live demo:** `https://<your-username>.github.io/via-browser-optimization-guide/` *(after you enable Pages — see below)*

---

## Highlights

**Content**
- Six-part guided setup: filter lists → WebView flags → privacy → testing → troubleshooting → maintenance
- Interactive progress tracking with a segmented six-step bar, progress ring and persisted state
- Working checklists (21 items) that survive page reloads via `localStorage`
- One-tap copy buttons for every filter-list URL and WebView flag
- Before/after metric comparison with animated bars
- Print stylesheet that expands every section and prints clean

**Craft**
- Design-token system: fluid type scale, 4px spacing grid, three-theme palette (light / dark / print)
- Light **and** dark theme with a persisted toggle and system-preference fallback
- Scrollspy sidebar on desktop, chip navigation on mobile
- Scroll-reveal animations, count-up figures and micro-interactions — all disabled under `prefers-reduced-motion`
- Zero dependencies, zero build step, two source files (`style.css`, `main.js`)

---

## Design system — "Pine & Bone"

A warm-paper editorial system with deep pine green as the working accent and amber reserved for warnings. Numbers are set in a monospace with tabular figures everywhere data appears; headlines use a high-contrast optical-size serif for personality.

### Typography

| Role | Face | Notes |
| --- | --- | --- |
| Display / headlines | **Fraunces** (variable) | `opsz` 120–144, `WONK` 1 for character; italic accents in pine |
| Body / UI | **Inter** | 15–16 px, 1.65–1.7 line height |
| Data / code / labels | **JetBrains Mono** | tabular numerals, uppercase kickers at 0.14–0.16 em tracking |

Fluid scale: hero `clamp(2.35rem … 3.85rem)`, section titles `clamp(1.65rem … 2.15rem)`, body 16 px.

### Palette

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--paper` | `#f3efe6` | `#141613` | page background |
| `--surface` | `#faf8f2` | `#1b1e1a` | cards, panels |
| `--ink` | `#201f1a` | `#ece8db` | primary text |
| `--ink-2` / `--ink-3` | `#5b574c` / `#767061` | `#b1ac9c` / `#8f8b7c` | secondary / muted text |
| `--line` / `--line-strong` | `#ddd7c6` / `#c6bfa9` | `#2b2f28` / `#454a3e` | hairline borders |
| `--pine` | `#2f5d4e` | `#7cc3a4` | accent, progress, active states |
| `--pine-soft` / `--pine-line` | `#e2eae0` / `#b7cec1` | 12 % / 38 % alpha | tints and accents |
| `--amber` | `#96601e` | `#d9a05b` | warnings (troubleshooting) |

### Layout & spacing

- 8 px baseline grid, tokens `--s1…--s8` (4 → 64 px)
- Content column capped at **800 px**; sidebar `268 px`; page shell max **1240 px**
- Radii: 8 / 12 / 16 px (`--r-sm/md/lg`); motion: two easing curves (`--ease` out-expo, `--spring` overshoot)

---

## Repository structure

```
via-browser-optimization-guide/
├── index.html          ← content + inline SVG icon sprite
├── favicon.svg
├── og-image.png        ← social preview card
├── LICENSE             ← MIT
├── .nojekyll           ← serve assets as-is on GitHub Pages
└── assets/
    ├── css/style.css   ← design system (19 documented sections)
    └── js/main.js      ← 12 behavior modules, zero dependencies
```

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `via-browser-optimization-guide`).
2. Push this folder's contents to the default branch (`main`):

   ```bash
   git init
   git add .
   git commit -m "Via Browser optimization guide"
   git branch -M main
   git remote add origin https://github.com/<your-username>/via-browser-optimization-guide.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / `(root)`, save.
4. Your guide is live at `https://<your-username>.github.io/via-browser-optimization-guide/`.

No build step is needed — the site is plain static files. (The `Source` link in the header currently points to `#`; set it to your repository URL in `index.html`.)

---

## Customizing

Everything visual lives in the token blocks at the top of `assets/css/style.css`:

- **Recolor** — edit the `:root` palette (light) and `[data-theme="dark"]` block (dark). `--pine` is the only accent most components reference.
- **Rescale** — type scale tokens (`--fs-*`), spacing tokens (`--s*`), radii and easing curves sit directly beneath.
- **Rebrand** — swap the wordmark in the header/footer and `favicon.svg`; the mark is a single rounded square with a serif "V".

JavaScript behaviors are in independent modules (`Theme`, `Progress`, `Checklists`, `Accordion`, `Nav`, `Copy`, `Metrics`, …) — remove any block you don't need.

### Browser support

Evergreen browsers. Uses `:has()`, `color-mix()`-free tokens, CSS grid animations (`grid-template-rows`), `IntersectionObserver` and `navigator.clipboard` — all with graceful fallbacks (content is never hidden if JS fails; clipboard falls back to `execCommand`).

---

## Accessibility

- Semantic landmarks, skip link, `aria-expanded`/`aria-controls` accordions, `role="status"` progress announcements
- Full keyboard support (visible `:focus-visible` rings throughout)
- `prefers-reduced-motion` disables every animation and count-up
- WCAG-AA-checked text contrast in both themes

## License

[MIT](LICENSE) — free to fork, remix and make your own.
