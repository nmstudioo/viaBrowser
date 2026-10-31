/* ==========================================================================
   VIA BROWSER — OPTIMIZATION GUIDE · main.js
   --------------------------------------------------------------------------
   Zero-dependency vanilla JS. Modules:

   01. Helpers            — DOM shortcuts, storage wrapper
   02. Theme              — light/dark toggle with persistence
   03. Reveal             — staggered scroll-in animations
   04. Count-up           — animated console numbers
   05. Progress           — six-part setup progress (bar, ring, status)
   06. Checklists         — persistent checkboxes + live per-part counters
   07. Accordion          — expand/collapse, deep links, done-marking
   08. Navigation         — scrollspy + smooth jump for TOC and chips
   09. Copy buttons       — clipboard with fallback + feedback
   10. Metrics            — animate before/after bars on visibility
   11. Chrome             — scroll progress, header shadow, back-to-top
   12. Print              — open all panels before printing, restore after
   ========================================================================== */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ======================================================================
     01. HELPERS
     ====================================================================== */

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* private mode */ }
    }
  };

  const announce = (msg) => { const live = $('#srLive'); if (live) live.textContent = msg; };

  const KEYS = {
    theme:  'viaguide:theme',
    checks: 'viaguide:checks',
    parts:  'viaguide:parts'
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  /* ======================================================================
     02. THEME
     ====================================================================== */

  const Theme = (() => {
    const root = document.documentElement;
    const btn = $('#themeToggle');

    const syncMetaColor = () => {
      const color = getComputedStyle(root).getPropertyValue('--paper').trim();
      $$('meta[name="theme-color"]').forEach((m) => { m.setAttribute('content', color); });
    };

    const toggle = () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theming');
      root.setAttribute('data-theme', next);
      store.set(KEYS.theme, next);
      syncMetaColor();
      announce(next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
      window.setTimeout(() => root.classList.remove('theming'), 350);
    };

    const init = () => {
      syncMetaColor();
      if (btn) btn.addEventListener('click', toggle);
    };

    return { init };
  })();

  /* ======================================================================
     03. REVEAL — staggered scroll-in (opt-in via html.js)
     ====================================================================== */

  const Reveal = (() => {
    const init = () => {
      const items = $$('[data-reveal]');
      if (!items.length) return;

      if (reducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in-view'));
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      items.forEach((el) => io.observe(el));
    };

    return { init };
  })();

  /* ======================================================================
     04. COUNT-UP — console figures count in when visible
     ====================================================================== */

  const CountUp = (() => {
    const run = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reducedMotion) { el.textContent = target.toLocaleString('en-US'); return; }

      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(easeOutCubic(p) * target).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const init = () => {
      const targets = $$('[data-count]');
      if (!targets.length) return;

      if (!('IntersectionObserver' in window)) {
        targets.forEach(run);
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      targets.forEach((el) => io.observe(el));
    };

    return { init };
  })();

  /* ======================================================================
     05. PROGRESS — six setup parts drive bar, ring and status
     ====================================================================== */

  const Progress = (() => {
    const TOTAL = 6;
    const RING_C = 2 * Math.PI * 24; // circumference of r=24 ring

    let opened = new Set(store.get(KEYS.parts, []));

    const el = {
      percent:    $('#progressPercent'),
      status:     $('#progressStatus'),
      segments:   $$('#trackerSegments .segment'),
      ringFill:   $('#ringFill'),
      ringLabel:  $('#ringPercent'),
      sideCount:  $('#sideCount')
    };

    const statusFor = (count, last) => {
      if (count === 0) return 'Open a part below to begin';
      if (count === TOTAL) return 'All six parts explored — setup complete';
      return count + ' of ' + TOTAL + ' parts explored · last opened: Part ' + String(last).padStart(2, '0');
    };

    const paint = (lastPart) => {
      const count = Math.min(opened.size, TOTAL);
      const pct = Math.round((count / TOTAL) * 100);

      if (el.percent) el.percent.textContent = String(pct);
      if (el.status) el.status.textContent = statusFor(count, lastPart || 1);

      el.segments.forEach((seg, i) => {
        seg.classList.toggle('done', opened.has(i + 1));
      });
      $('#trackerSegments').classList.toggle('complete', count === TOTAL);

      if (el.ringFill) el.ringFill.style.strokeDashoffset = String(RING_C * (1 - count / TOTAL));
      if (el.ringLabel) el.ringLabel.textContent = pct + '%';
      if (el.sideCount) el.sideCount.textContent = count + ' / ' + TOTAL + ' parts';

      // "Done" ticks in the chip nav and sidebar TOC
      $$('.chip[data-target], .toc-link[data-target]').forEach((link) => {
        const id = link.getAttribute('data-target');
        const match = /^acc-part(\d)$/.exec(id);
        if (match) link.classList.toggle('done', opened.has(parseInt(match[1], 10)));
      });
    };

    const mark = (part) => {
      if (!part) return;
      opened.add(part);
      store.set(KEYS.parts, Array.from(opened));
      paint(part);
    };

    const reset = () => {
      opened = new Set();
      store.remove(KEYS.parts);
      paint();
    };

    const init = () => { paint(); };

    return { init, mark, reset, isOpen: (p) => opened.has(p) };
  })();

  /* ======================================================================
     06. CHECKLISTS — persisted state + live counters in part headers
     ====================================================================== */

  const Checklists = (() => {
    let state = store.get(KEYS.checks, {});
    const boxes = $$('.check input[type="checkbox"]');
    const counters = $$('[data-checkcount]');

    const refreshCounter = (container) => {
      const out = $('[data-countvalue]', container);
      if (!out) return;
      const boxesIn = $$('.check input[type="checkbox"]', container);
      const done = boxesIn.filter((b) => b.checked).length;
      out.textContent = String(done);
      return done === boxesIn.length;
    };

    const init = () => {
      boxes.forEach((box) => {
        if (state[box.id]) {
          box.checked = true;
          const wrap = box.closest('.check');
          if (wrap) wrap.classList.add('checked');
        }
        box.addEventListener('change', () => {
          state[box.id] = box.checked;
          store.set(KEYS.checks, state);
          const wrap = box.closest('.check');
          if (wrap) wrap.classList.toggle('checked', box.checked);

          const container = box.closest('[data-checkcount]');
          if (container) {
            const complete = refreshCounter(container);
            if (complete) announce('Checklist complete');
          }
        });
      });
      counters.forEach(refreshCounter);
    };

    const reset = () => {
      state = {};
      store.remove(KEYS.checks);
      boxes.forEach((box) => {
        box.checked = false;
        const wrap = box.closest('.check');
        if (wrap) wrap.classList.remove('checked');
      });
      counters.forEach(refreshCounter);
    };

    return { init, reset };
  })();

  /* ======================================================================
     07. ACCORDION — toggle, aria state, deep links, part marking
     ====================================================================== */

  const Accordion = (() => {
    const open = (item) => {
      if (!item || item.classList.contains('open')) return;
      item.classList.add('open');
      const btn = $('.acc-btn', item);
      if (btn) btn.setAttribute('aria-expanded', 'true');
      const part = parseInt(item.getAttribute('data-part'), 10);
      if (part) Progress.mark(part);
    };

    const toggle = (item) => {
      if (!item) return;
      const willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      const btn = $('.acc-btn', item);
      if (btn) btn.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        const part = parseInt(item.getAttribute('data-part'), 10);
        if (part) Progress.mark(part);
      }
    };

    const init = () => {
      $$('.acc-btn').forEach((btn) => {
        btn.addEventListener('click', () => toggle(btn.closest('.acc')));
      });

      // Deep link: /#acc-part3 opens Part 3 on arrival
      const openFromHash = () => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        const item = document.getElementById(id);
        if (item && item.classList.contains('acc')) {
          window.setTimeout(() => {
            open(item);
            Nav.scrollToId(id);
          }, 120);
        }
      };
      openFromHash();
      window.addEventListener('hashchange', openFromHash);
    };

    return { init, open, toggle };
  })();

  /* ======================================================================
     08. NAVIGATION — scrollspy + smooth jump (TOC links & mobile chips)
     ====================================================================== */

  const Nav = (() => {
    const scrollToId = (id) => {
      const target = document.getElementById(id);
      if (!target) return;

      const header = $('#siteHeader');
      const chips = $('.chip-nav');
      const offset = (header ? header.offsetHeight : 0) + (chips ? chips.offsetHeight : 0) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    const setActive = (id) => {
      $$('.toc-link[data-target], .chip[data-target]').forEach((link) => {
        link.classList.toggle('active', !!id && link.getAttribute('data-target') === id);
      });
    };

    const init = () => {
      // Smooth-jump for every internal nav link
      $$('.toc-link[data-target], .chip[data-target], .footer-col a[href^="#acc-"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const id = href ? href.slice(1) : link.getAttribute('data-target');
          if (!document.getElementById(id)) return;
          e.preventDefault();
          if (id.indexOf('acc-') === 0) Accordion.open(document.getElementById(id));
          scrollToId(id);
          setActive(id);
          history.replaceState(null, '', '#' + id);
        });
      });

      if (!('IntersectionObserver' in window)) return;

      // Track which targets currently sit in the spy band; when none do
      // (hero, tracker, gaps), no TOC item is highlighted.
      const visible = new Set();

      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setActive(visible.size ? Array.from(visible).pop() : null);
      }, { rootMargin: '-30% 0px -62% 0px', threshold: 0 });

      $$('#acc-achieve, #acc-prereq, .acc[data-part], #results, #summary').forEach((el) => spy.observe(el));
    };

    return { init, scrollToId, setActive };
  })();

  /* ======================================================================
     09. COPY BUTTONS — clipboard with fallback + visual feedback
     ====================================================================== */

  const Copy = (() => {
    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    const copy = (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
      }
      return Promise.resolve(fallbackCopy(text));
    };

    const init = () => {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-btn');
        if (!btn || btn.classList.contains('copied')) return;

        const text = btn.getAttribute('data-copy') || '';
        const original = btn.textContent;

        copy(text).then((ok) => {
          btn.textContent = ok ? 'Copied' : 'Failed';
          btn.classList.add('copied');
          announce(ok ? 'Copied to clipboard' : 'Copy failed');
          window.setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
          }, 1800);
        });
      });
    };

    return { init };
  })();

  /* ======================================================================
     10. METRICS — fill before/after bars when they scroll into view
     ====================================================================== */

  const Metrics = (() => {
    const fill = (panel) => {
      $$('.metric-fill', panel).forEach((bar) => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    };

    const init = () => {
      const panels = $$('[data-metrics]');
      if (!panels.length) return;

      if (reducedMotion || !('IntersectionObserver' in window)) {
        panels.forEach(fill);
        return;
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      panels.forEach((p) => io.observe(p));
    };

    return { init };
  })();

  /* ======================================================================
     11. CHROME — scroll progress bar, header shadow, back-to-top
     ====================================================================== */

  const Chrome = (() => {
    const bar = $('#scrollProgressBar');
    const header = $('#siteHeader');
    const toTop = $('#toTop');
    let ticking = false;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;

      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      if (header) header.classList.toggle('scrolled', y > 4);
      if (toTop) toTop.classList.toggle('show', y > 560);
      ticking = false;
    };

    const init = () => {
      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScroll);
        }
      }, { passive: true });
      onScroll();

      if (toTop) {
        toTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        });
      }

      const yearEl = $('#footerYear');
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    };

    return { init };
  })();

  /* ======================================================================
     12. PRINT — expand every panel, restore state afterwards
     ====================================================================== */

  const PrintSupport = (() => {
    let snapshot = [];

    const init = () => {
      window.addEventListener('beforeprint', () => {
        snapshot = $$('.acc').map((acc) => acc.classList.contains('open'));
        $$('.acc').forEach((acc) => {
          acc.classList.add('open');
          const btn = $('.acc-btn', acc);
          if (btn) btn.setAttribute('aria-expanded', 'true');
        });
      });

      window.addEventListener('afterprint', () => {
        $$('.acc').forEach((acc, i) => {
          const wasOpen = snapshot[i];
          acc.classList.toggle('open', wasOpen);
          const btn = $('.acc-btn', acc);
          if (btn) btn.setAttribute('aria-expanded', String(!!wasOpen));
        });
      });
    };

    return { init };
  })();

  /* ======================================================================
     RESET — clears checklists and part progress (theme is kept)
     ====================================================================== */

  const initReset = () => {
    const btn = $('#resetProgress');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!window.confirm('Clear all checked items and saved progress on this device?')) return;
      Checklists.reset();
      Progress.reset();
      announce('Progress reset');
    });
  };

  /* ======================================================================
     BOOT
     ====================================================================== */

  const boot = () => {
    Theme.init();
    Progress.init();
    Checklists.init();
    Accordion.init();
    Nav.init();
    Reveal.init();
    CountUp.init();
    Metrics.init();
    Copy.init();
    Chrome.init();
    PrintSupport.init();
    initReset();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
