/* ============================================================
   CK Industrial Automation Services – site.js
   Mobile Navigation, Einblenden beim Scrollen, Zähler, Reiter (Referenz).
   Hinweis: Kontaktdaten stehen bewusst NUR als Bild auf der Seite
   (kein mailto-Link, keine Adresse im Quelltext).
   Stand: 12.11.2026 (Reiter ergänzt) · Erstfassung 31.10.2026
   ============================================================ */
(function () {
  'use strict';


  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(function () {

    /* ===================== MOBILE NAVIGATION ===================== */
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      var iconOpen = toggle.querySelector('[data-icon="open"]');
      var iconClose = toggle.querySelector('[data-icon="close"]');
      var setOpen = function (open) {
        menu.classList.toggle('hidden', !open);
        iconOpen.classList.toggle('hidden', open);
        iconClose.classList.toggle('hidden', !open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      };
      toggle.addEventListener('click', function () {
        setOpen(menu.classList.contains('hidden'));
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) { setOpen(false); toggle.focus(); }
      });
    }

    /* ===================== EINBLENDEN BEIM SCROLLEN ===================== */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { ro.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* ===================== ZÄHLER ===================== */
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var animateCount = function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var dur = 1400, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      };
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }

    /* ===================== REITER (Referenz: Anlagenteile) ===================== */
    /* Ohne JS sind alle Bereiche sichtbar und die Reiter springen per Anker dorthin. */
    document.querySelectorAll('[data-tabs]').forEach(function (box) {
      var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
      var select = function (i, focus) {
        tabs.forEach(function (t, j) {
          var on = j === i;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          if (panels[j]) panels[j].hidden = !on;
        });
        if (focus) tabs[i].focus();
      };
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function (e) { e.preventDefault(); select(i, false); });
        t.addEventListener('keydown', function (e) {
          var n = tabs.length, k = e.key, to = null;
          if (k === 'ArrowRight' || k === 'ArrowDown') to = (i + 1) % n;
          else if (k === 'ArrowLeft' || k === 'ArrowUp') to = (i - 1 + n) % n;
          else if (k === 'Home') to = 0;
          else if (k === 'End') to = n - 1;
          if (to !== null) { e.preventDefault(); select(to, true); }
        });
      });
      var start = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
      select(start < 0 ? 0 : start, false);
    });

  });
})();
