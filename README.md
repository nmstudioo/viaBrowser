<div align="center">

<img src="assets/cover.svg" alt="Via Browser Optimization Guide" width="100%">

# Via Browser · Optimization Guide

**Speed, unlocked.**  
A precision field guide to mastering ad-blocking, WebView flags, and privacy settings on Android.

[![Live Demo](https://img.shields.io/badge/VIEW%20LIVE%20GUIDE-viaBrowser-2f5d4e?style=for-the-badge&labelColor=f3efe6)](https://nmstudioo.github.io/viaBrowser/)
![Platform](https://img.shields.io/badge/ANDROID%20%7C%20VIA%20BROWSER-2f5d4e?style=flat-square&labelColor=f3efe6)
![Dependencies](https://img.shields.io/badge/ZERO%20DEPENDENCIES-96601e?style=flat-square&labelColor=f3efe6)

[Overview](#overview) · [Features](#features) · [Design](#design-system) · [Structure](#repository-structure)

</div>

---

## Overview

Via Browser is a fast micro-client, but its default configuration leaves significant performance on the table. This project is a six-part static guide that walks you through filter lists, WebView speed flags, privacy hardening, and testing methodology. No root, no developer background required.

> [!NOTE]
> This is an independent field guide. It is not affiliated with the Via Browser development team.

| Attribute | Value |
|:--|:--|
| **Format** | Dependency-free static HTML |
| **Design system** | "Pine & Bone" (warm editorial) |
| **Setup time** | 10–15 minutes |
| **Build step** | None |

---

## Features

### Content
- **Six-part guided setup:** Filter lists → WebView flags → privacy → testing → troubleshooting → maintenance.
- **Interactive progress tracking:** Segmented six-step bar, progress ring, and persisted state.
- **Persistent checklists:** 21 items that survive page reloads via `localStorage`.
- **One-tap copy:** Filter-list URLs and WebView flags copy to clipboard instantly.

### Craft
- **Tokenized design system:** Fluid type scale, 4 px spacing grid, three-theme palette (light / dark / print).
- **Scrollspy sidebar:** Desktop sidebar with mobile chip navigation fallback.
- **Accessibility:** WCAG-AA contrast, `prefers-reduced-motion` support, full keyboard navigation.

---

## Design System — "Pine & Bone"

A warm-paper editorial system with deep pine green as the working accent and amber reserved for warnings. Numbers are set in a monospace with tabular figures everywhere data appears.

| Role | Face | Notes |
|:--|:--|:--|
| Display / headlines | **Fraunces** | `opsz` 120–144, `WONK` 1 |
| Body / UI | **Inter** | 15–16 px, 1.65–1.7 line height |
| Data / code | **JetBrains Mono** | Tabular numerals |

| Token | Light | Dark | Use |
|:--|:--|:--|:--|
| `--paper` | `#f3efe6` | `#141613` | Page background |
| `--pine` | `#2f5d4e` | `#7cc3a4` | Accent, progress |
| `--amber` | `#96601e` | `#d9a05b` | Warnings |

---

## Repository Structure

```text
via-browser-optimization-guide/
├── index.html          ← content + inline SVG icon sprite
├── favicon.svg
├── og-image.png        ← social preview card
├── .nojekyll           ← serve assets as-is on GitHub Pages
└── assets/
    ├── css/style.css   ← design system (19 documented sections)
    └── js/main.js      ← 12 behavior modules, zero dependencies
```

---

<div align="center">
<sub>Designed &amp; tuned by <b>Noushad M.</b> · © 2026</sub>
</div>
