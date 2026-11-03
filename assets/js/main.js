/* ==========================================================================
   O'Stud · Template 2 · main.js
   One namespace (window.Snack). Every feature degrades to plain HTML/CSS.
   ========================================================================== */
(function () {
  'use strict';

  var Snack = (window.Snack = window.Snack || {});
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Hours and open status ---------- */

  // "11:30" -> 690. Returns null when the value is missing or malformed.
  function toMinutes(str) {
    var m = /^(\d{1,2}):(\d{2})$/.exec((str || '').trim());
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  }

  // 120 -> "2h", 690 -> "11h30"
  function formatTime(min) {
    var h = Math.floor(min / 60) % 24;
    var m = min % 60;
    return m === 0 ? h + 'h' : h + 'h' + String(m).padStart(2, '0');
  }

  // Each day has up to two slots: data-open / data-close and data-open-2 / data-close-2.
  function getSlots(li) {
    var slots = [];
    [['data-open', 'data-close'], ['data-open-2', 'data-close-2']].forEach(function (pair) {
      var open = toMinutes(li.getAttribute(pair[0]));
      var close = toMinutes(li.getAttribute(pair[1]));
      if (open !== null && close !== null) slots.push({ open: open, close: close });
    });
    return slots;
  }

  // Indexed by JS day (0 = dimanche). A closed or unfilled day is an empty array.
  function readSchedule() {
    var days = [];
    for (var d = 0; d < 7; d++) days[d] = [];
    $$('[data-hours] li[data-day]').forEach(function (li) {
      days[Number(li.getAttribute('data-day'))] = getSlots(li);
    });
    return days;
  }

  // Replaces the [HORAIRES] placeholder with the real times once filled in.
  function fillHours() {
    $$('[data-hours] li[data-day]').forEach(function (li) {
      if (li.hasAttribute('data-label')) return;
      var slots = getSlots(li);
      var out = li.querySelector('.sn-hours__time');
      if (out && slots.length) {
        out.textContent = slots.map(function (s) {
          return formatTime(s.open) + '–' + formatTime(s.close);
        }).join(' · ');
      }
    });
  }

  function getStatus(now) {
    var schedule = readSchedule();
    if (!schedule.some(function (day) { return day.length; })) {
      return { open: false, text: 'Horaires à compléter' };
    }

    var today = now.getDay();
    var minutes = now.getHours() * 60 + now.getMinutes();

    // Slots from yesterday that run past midnight (e.g. 18:00 → 02:00).
    var yesterday = schedule[(today + 6) % 7];
    for (var y = 0; y < yesterday.length; y++) {
      if (yesterday[y].close <= yesterday[y].open && minutes < yesterday[y].close) {
        return { open: true, text: 'Ouvert · ferme à ' + formatTime(yesterday[y].close) };
      }
    }

    // Today's slots, adding 24 h when a slot closes after midnight.
    var slots = schedule[today];
    for (var s = 0; s < slots.length; s++) {
      var close = slots[s].close <= slots[s].open ? slots[s].close + 1440 : slots[s].close;
      if (minutes >= slots[s].open && minutes < close) {
        return { open: true, text: 'Ouvert · ferme à ' + formatTime(close) };
      }
    }
    for (var n = 0; n < slots.length; n++) {
      if (minutes < slots[n].open) {
        return { open: false, text: 'Fermé · ouvre à ' + formatTime(slots[n].open) };
      }
    }

    // Closed for the rest of today: find the next opening.
    for (var i = 1; i <= 7; i++) {
      var next = schedule[(today + i) % 7];
      if (next.length) {
        return { open: false, text: 'Fermé · ouvre à ' + formatTime(next[0].open) };
      }
    }
    return { open: false, text: 'Fermé' };
  }

  function renderStatus() {
    var now = new Date();
    var status = getStatus(now);

    $$('[data-open-status]').forEach(function (el) {
      el.textContent = status.text;
      el.classList.toggle('is-open', status.open);
      el.classList.toggle('is-closed', !status.open);
    });

    $$('[data-hours] li[data-day]').forEach(function (li) {
      li.classList.toggle('is-today', Number(li.getAttribute('data-day')) === now.getDay());
    });
  }

  /* ---------- Mobile drawer ---------- */
  Snack.drawer = (function () {
    var burger = $('[data-burger]');
    var drawer = $('#drawer');
    var closeBtn = $('[data-drawer-close]');
    if (!burger || !drawer) return {};

    var lastFocus = null;

    function focusables() {
      return $$('a[href], button:not([disabled])', drawer);
    }

    function open() {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }

    function close() {
      drawer.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (drawer.hidden) return;
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      // Focus trap: cycle Tab inside the open drawer.
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    return { open: open, close: close };
  })();

  /* ---------- Carte: ARIA tabs and deep links ---------- */
  Snack.menu = (function () {
    var tablist = $('[data-tablist]');
    if (!tablist) return {};

    var tabs = $$('[role="tab"]', tablist);

    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }

    function findTab(slug) {
      return tabs.filter(function (t) { return t.getAttribute('data-panel') === slug; })[0];
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { activate(tab, false); });
    });

    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      activate(tabs[next], true);
    });

    // Footer links and the signature button: open a tab, the anchor scrolls.
    $$('[data-menu-target]').forEach(function (el) {
      el.addEventListener('click', function () {
        var tab = findTab(el.getAttribute('data-menu-target'));
        if (tab) activate(tab, false);
      });
    });

    return { activate: activate, findTab: findTab };
  })();

  /* ---------- Scroll reveal ---------- */
  Snack.reveal = (function () {
    var items = $$('.sn-reveal');
    if (!items.length) return {};

    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return {};
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
    return {};
  })();

  /* ---------- Header shadow and scroll progress ---------- */
  Snack.chrome = (function () {
    var bar = $('[data-progress]');
    var header = $('.sn-header');
    var ticking = false;

    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = 'scaleX(' + progress + ')';
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return {};
  })();

  /* ---------- Lightbox ---------- */
  Snack.lightbox = (function () {
    var dialog = document.getElementById('lightbox');
    var items = $$('[data-gallery-item]');
    if (!dialog || !items.length || typeof dialog.showModal !== 'function') return {};

    var img = $('img', dialog);
    var caption = $('[data-lightbox-caption]', dialog);
    var count = $('[data-lightbox-count]', dialog);
    var index = 0;
    var trigger = null;

    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      img.src = item.getAttribute('data-full');
      img.alt = item.getAttribute('data-caption');
      caption.textContent = item.getAttribute('data-caption');
      count.textContent = (index + 1) + ' / ' + items.length;
    }

    function open(i) {
      trigger = document.activeElement;
      show(i);
      dialog.showModal();
    }

    items.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });

    $('[data-lightbox-prev]', dialog).addEventListener('click', function () { show(index - 1); });
    $('[data-lightbox-next]', dialog).addEventListener('click', function () { show(index + 1); });
    $('[data-lightbox-close]', dialog).addEventListener('click', function () { dialog.close(); });

    // Click on the backdrop (the dialog itself) closes it.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });

    dialog.addEventListener('close', function () {
      if (trigger) trigger.focus();
    });

    return { open: open, close: function () { dialog.close(); } };
  })();

  /* ---------- Init ---------- */
  function init() {
    window.__ready = true;

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    fillHours();
    renderStatus();
    window.setInterval(renderStatus, 60000);
  }

  init();
})();
