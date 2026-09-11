/* =============================================================
   FARM BRAIN — interactions (vanilla JavaScript, no dependencies)
   -------------------------------------------------------------
   1.  Sticky nav shadow on scroll
   2.  Mobile hamburger menu
   3.  Solutions tabs (ARIA)
   4.  FAQ accordion
   5.  Scroll-reveal via IntersectionObserver
   6.  Count-up number animations
   7.  Cookie consent banner (localStorage)
   8.  Contact form validation + fake submit
   9.  Footer year
   ============================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* 1. ── Sticky nav shadow ─────────────────────────────────── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 2. ── Mobile hamburger menu ─────────────────────────────── */
  const toggle = $('#navToggle');
  const menu = $('#navMenu');

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is clicked or Escape is pressed
  $$('#navMenu a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* 3. ── Solutions tabs ────────────────────────────────────── */
  const tabWrap = $('#solutionTabs');
  if (tabWrap) {
    const tabs = $$('.tabs__tab', tabWrap);
    const panels = $$('.tabs__panel', tabWrap);

    const activate = (i) => {
      tabs.forEach((t, idx) => {
        const selected = idx === i;
        t.classList.toggle('is-active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((p, idx) => {
        const show = idx === i;
        p.classList.toggle('is-active', show);
        p.hidden = !show;
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i));
      // Arrow-key navigation for accessibility
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (i + dir + tabs.length) % tabs.length;
        activate(next);
        tabs[next].focus();
      });
    });
  }

  /* 4. ── FAQ accordion ─────────────────────────────────────── */
  $$('#accordion .accordion__item').forEach((item) => {
    const trigger = $('.accordion__trigger', item);
    const panel = $('.accordion__panel', item);

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close every item (single-open accordion)
      $$('#accordion .accordion__item').forEach((other) => {
        other.classList.remove('is-open');
        $('.accordion__trigger', other).setAttribute('aria-expanded', 'false');
        $('.accordion__panel', other).style.maxHeight = null;
      });

      // Open this one unless it was already open
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* 5. ── Scroll reveal ─────────────────────────────────────── */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // Stagger siblings slightly for a nicer cascade
          entry.target.style.transitionDelay = (i % 4) * 80 + 'ms';
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* 6. ── Count-up animations ──────────────────────────────── */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const decimals = (String(target).split('.')[1] || '').length;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const val = (target * eased).toFixed(decimals);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* 7. ── Cookie consent banner ─────────────────────────────── */
  const banner = $('#cookieBanner');
  const COOKIE_KEY = 'fb-cookie-consent';

  const showBanner = () => { banner.hidden = false; };
  const hideBanner = () => { banner.hidden = true; };

  let stored = null;
  try { stored = localStorage.getItem(COOKIE_KEY); } catch (e) { /* storage blocked */ }

  if (!stored) {
    // Small delay so it animates in after load
    setTimeout(showBanner, 900);
  }

  $$('#cookieBanner [data-cookie]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.cookie; // reject | customize | accept
      try { localStorage.setItem(COOKIE_KEY, choice); } catch (e) { /* ignore */ }
      hideBanner();
    });
  });

  // "Cookie Settings" link in footer re-opens the banner
  const cookieLink = $('#cookieSettings');
  if (cookieLink) {
    cookieLink.addEventListener('click', (e) => {
      e.preventDefault();
      showBanner();
    });
  }

  /* 8. ── Contact form ──────────────────────────────────────── */
  const form = $('#contactForm');
  if (form) {
    const status = $('#formStatus');

    const setError = (field, on) =>
      field.closest('.field').classList.toggle('has-error', on);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name');
      const email = $('#email');
      let ok = true;

      if (!name.value.trim()) { setError(name, true); ok = false; } else setError(name, false);

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) { setError(email, true); ok = false; } else setError(email, false);

      if (!ok) {
        status.textContent = 'Please fill in your name and a valid email.';
        status.className = 'form-status is-error';
        return;
      }

      // Simulate an async submit (no backend in this static build)
      const btn = $('button[type="submit"]', form);
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = '0.7';
      status.textContent = 'Sending…';
      status.className = 'form-status';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.style.opacity = '';
        btn.innerHTML = label;
        status.textContent = "Thanks! We'll be in touch within 24 hours. 🌱";
        status.className = 'form-status is-success';
      }, 1100);
    });

    // Clear a field's error state as the user types
    $$('#contactForm input, #contactForm select, #contactForm textarea').forEach((el) => {
      el.addEventListener('input', () => setError(el, false));
    });
  }

  /* 9. ── Live sensor ticker ────────────────────────────────── */
  const liveEls = $$('[data-live]');
  if (liveEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const jitter = () => {
      liveEls.forEach((el) => {
        const min = parseFloat(el.dataset.min);
        const max = parseFloat(el.dataset.max);
        const dp = parseInt(el.dataset.dp, 10) || 1;
        const val = (min + Math.random() * (max - min)).toFixed(dp);
        el.textContent = val;
      });
    };
    setInterval(jitter, 2200);
  }

  /* 10. ── Footer year ──────────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
