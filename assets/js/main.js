// Graceful Cleaning Services — interactions
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header shadow once the page leaves the top (observer, no scroll listener)
  const header = $('[data-header]');
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
  document.body.prepend(sentinel);
  // Read the latest entry: a fast jump (anchor, restored scroll) can batch several
  new IntersectionObserver((entries) => header.classList.toggle('is-scrolled', !entries[entries.length - 1].isIntersecting)).observe(sentinel);

  // Staggered entry: children of [data-reveal] cascade in when the group arrives
  const groups = $$('[data-reveal]');
  groups.forEach((group) => [...group.children].forEach((child, i) => child.style.setProperty('--i', i)));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    groups.forEach((group) => group.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    groups.forEach((group) => revealObserver.observe(group));
  }

  // Mobile menu
  const menuBtn = $('[data-menu]');
  const nav = $('[data-nav]');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Active nav link
  const links = $$('.nav a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObserver.observe(s));

  // Light sweep on window-framed photos as they arrive
  const lit = $$('[data-sweep], [data-compare]');
  lit.forEach((el) => {
    const g = document.createElement('span');
    g.className = 'glint';
    g.setAttribute('aria-hidden', 'true');
    el.appendChild(g);
  });
  if (!reduceMotion) {
    const sweepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          sweepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    lit.forEach((el) => sweepObserver.observe(el));
  }

  // Before / after: the window mullion wipes the room clean
  // AI-generated illustrative pairs (no on-page disclosure, by client decision). Swap for real client pairs when available.
  const ROOMS = {
    kitchen:  { after: 'assets/img/result-kitchen-after.webp', before: 'assets/img/result-kitchen-before.webp', alt: 'Illustrative kitchen after cleaning, with clear granite counters and a clean stovetop' },
    bathroom: { after: 'assets/img/result-bathroom-after.webp', before: 'assets/img/result-bathroom-before.webp', alt: 'Illustrative bathroom after cleaning, with clear shower glass and a clean vanity' },
    living:   { after: 'assets/img/result-living-after.webp', before: 'assets/img/result-living-before.webp', alt: 'Illustrative living room after cleaning, with a tidy coffee table and vacuumed rug' },
  };
  const compare = $('[data-compare]');
  if (compare) {
    const range = $('[data-range]', compare);
    const afterImg = $('[data-after]', compare);
    const beforeImg = $('[data-before]', compare);
    const setPos = (v) => compare.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => setPos(range.value));
    range.addEventListener('pointerdown', () => compare.classList.add('is-dragging'));
    window.addEventListener('pointerup', () => compare.classList.remove('is-dragging'));

    // Gentle hint: the frame glides once when first seen
    if (!reduceMotion) {
      const hint = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        hint.disconnect();
        const start = performance.now();
        const run = (t) => {
          const p = Math.min((t - start) / 1600, 1);
          const v = 50 + Math.sin(p * Math.PI * 2) * 16 * (1 - p);
          if (range.dataset.touched !== '1') { range.value = v; setPos(v); }
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }, { threshold: 0.6 });
      hint.observe(compare);
      range.addEventListener('pointerdown', () => { range.dataset.touched = '1'; }, { once: true });
      range.addEventListener('keydown', () => { range.dataset.touched = '1'; }, { once: true });
    }

    const tabs = $$('[role="tab"]');
    const selectTab = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      const room = ROOMS[tab.dataset.room];
      compare.classList.add('is-swapping');
      setTimeout(() => {
        afterImg.src = room.after;
        afterImg.alt = room.alt;
        beforeImg.src = room.before;
        range.value = 50;
        setPos(50);
        compare.classList.remove('is-swapping');
      }, reduceMotion ? 0 : 300);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        selectTab(next);
      });
    });
  }

  // Mobile action bar hides while the form is on screen
  const bar = $('[data-action-bar]');
  const contact = $('#contact');
  if (bar && contact) {
    new IntersectionObserver((entries) => bar.classList.toggle('is-hidden', entries[entries.length - 1].isIntersecting), { threshold: 0.15 }).observe(contact);
  }

  // Quote form: three short steps. Without JS every step shows and the form posts normally.
  const form = $('[data-form]');
  if (form) {
    const status = $('[data-status]', form);
    const submit = $('[data-submit]', form);
    const submitLabel = $('[data-label]', submit);
    const idleLabel = submitLabel.textContent;
    const success = $('[data-success]');
    const steps = $$('[data-step]', form);
    const next = $('[data-next]', form);
    const back = $('[data-back]', form);
    const progress = $('[data-progress]', form);
    const stepCount = $('[data-step-count]', form);
    const announce = $('[data-announce]', form);
    let current = 0;

    const rules = {
      service: (v) => v !== '',
      town: (v) => v.trim().length > 1,
      name: (v) => v.trim().length > 1,
      phone: (v) => v.replace(/\D/g, '').length === 10,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    };
    // Works for text inputs and radio groups alike (RadioNodeList.value is the checked value)
    const check = (name) => {
      const ok = rules[name](form.elements[name].value);
      const field = $(`[data-field="${name}"]`, form);
      field.classList.toggle('has-error', !ok);
      const target = $('[role="radiogroup"]', field) || form.elements[name];
      target.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    // US phone mask: (508) 395-9441. Keeps the caret after the same digit while typing or deleting.
    const formatPhone = (raw) => {
      let d = raw.replace(/\D/g, '');
      if (d.length > 10 && d[0] === '1') d = d.slice(1);
      d = d.slice(0, 10);
      if (!d) return '';
      if (d.length < 4) return `(${d}`;
      if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    };
    const phone = $('[data-phone]', form);
    phone.addEventListener('input', () => {
      const digitsBefore = phone.value.slice(0, phone.selectionStart).replace(/\D/g, '').length;
      const formatted = formatPhone(phone.value);
      phone.value = formatted;
      let pos = 0;
      for (let seen = 0; pos < formatted.length && seen < digitsBefore; pos++) if (/\d/.test(formatted[pos])) seen++;
      phone.setSelectionRange(pos, pos);
    });
    const fieldsIn = (scope) => $$('[data-field]', scope).map((f) => f.dataset.field);
    const firstControl = (scope) => $('input:not([type="hidden"]):not(.hp), textarea, select', scope);

    Object.keys(rules).forEach((name) => {
      const field = $(`[data-field="${name}"]`, form);
      $$('input, textarea', field).forEach((input) => {
        input.addEventListener('blur', () => { if (input.type !== 'radio' && input.value) check(name); });
        input.addEventListener(input.type === 'radio' ? 'change' : 'input', () => { if (field.classList.contains('has-error')) check(name); });
      });
    });

    const showStep = (i, { focus = true } = {}) => {
      current = i;
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
      $$('.progress-bar span', form).forEach((bar, n) => bar.classList.toggle('is-done', n <= i));
      stepCount.textContent = `Step ${i + 1} of ${steps.length}`;
      const last = i === steps.length - 1;
      back.hidden = i === 0;
      next.hidden = last;
      submit.hidden = !last;
      status.textContent = '';
      if (focus) {
        const control = $('[role="radiogroup"] input:checked', steps[i]) || firstControl(steps[i]);
        if (control) control.focus({ preventScroll: true });
        form.closest('.form-card').scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
        announce.textContent = `Step ${i + 1} of ${steps.length}: ${$('.step-title', steps[i]).textContent}`;
      }
    };
    const stepValid = (i) => {
      const invalid = fieldsIn(steps[i]).filter((name) => !check(name));
      if (invalid.length) {
        const field = $(`[data-field="${invalid[0]}"]`, form);
        (firstControl(field)).focus();
        return false;
      }
      return true;
    };

    form.classList.add('is-stepped');
    progress.hidden = false;
    next.addEventListener('click', () => { if (stepValid(current)) showStep(current + 1); });
    back.addEventListener('click', () => showStep(current - 1));
    showStep(0, { focus: false });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Enter on an earlier step moves forward instead of sending
      if (current < steps.length - 1) {
        if (stepValid(current)) showStep(current + 1);
        return;
      }
      status.textContent = '';
      // Re-check every step in case something was left behind
      const badStep = steps.findIndex((s) => fieldsIn(s).some((name) => !rules[name](form.elements[name].value)));
      if (badStep !== -1) {
        showStep(badStep);
        stepValid(badStep);
        status.textContent = 'Please fix the highlighted fields.';
        return;
      }
      if (form.elements.access_key.value.startsWith('YOUR_')) {
        status.textContent = 'The form is not connected yet. Please text (508) 395-9441 and we’ll get right back to you.';
        return;
      }
      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');
      submitLabel.textContent = 'Sending your request…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Request failed');
        form.hidden = true;
        success.hidden = false;
        success.focus();
      } catch (err) {
        status.textContent = 'We couldn’t send your request. Please try again, or text (508) 395-9441.';
      } finally {
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-busy');
        submitLabel.textContent = idleLabel;
      }
    });
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
