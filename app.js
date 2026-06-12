/* ============================================================
   CK Industrial Automation Services — app.js
   ============================================================ */
(function () {
  'use strict';



  /* ---------- E-Mail (erst im Browser zusammengesetzt, Spam-Schutz) ---------- */
  var MAIL = (function () {
    var u = ['ck', '-industrial-', 'automation', '-services'].join('');
    var d = ['paderborn', '.', 'com'].join('');
    return u + '\u0040' + d;
  })();

  var ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(function () {

    /* ===================== NAV ===================== */
    var nav = document.getElementById('nav');
    var toggle = nav && nav.querySelector('.nav-toggle');
    var navLinks = document.getElementById('navLinks');

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      });
    }
    if (navLinks) {
      navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a') && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });


    /* ===================== REVEAL ON SCROLL ===================== */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { ro.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }


    /* ===================== STAT COUNTERS ===================== */
    var counters = document.querySelectorAll('[data-count]');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var dur = 1400, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    }


    /* ===================== HERO WORD ROTATOR ===================== */
    var rotEl = document.querySelector('.rotator-word');
    if (rotEl) {
      var words = ['Siemens S7 & TIA Portal', 'SPS-Programmierung', 'Inbetriebnahme & Fehlersuche', 'IIoT & Maschinendaten', 'Python & Node-RED'];
      var ri = 0;
      setInterval(function () {
        ri = (ri + 1) % words.length;
        var span = document.createElement('span');
        span.className = 'rotator-word';
        span.textContent = words[ri];
        rotEl.replaceWith(span);
        rotEl = span;
      }, 2400);
    }


    /* ===================== OFFER ACCORDIONS ===================== */
    /* Hinweis: Die SPS-Schwerpunkt-Karte startet geöffnet (class="open", Panel ohne hidden). */
    document.querySelectorAll('.offer-toggle').forEach(function (btn) {
      var card = btn.closest('.offer-card');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.transition = 'max-height .4s ease, opacity .4s ease';
        if (open) {
          panel.hidden = false;
          panel.style.maxHeight = '0px';
          panel.style.opacity = '0';
          requestAnimationFrame(function () {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.opacity = '1';
          });
          var grew = function (e) {
            if (e.propertyName !== 'max-height') return;
            if (card.classList.contains('open')) panel.style.maxHeight = 'none';
            panel.removeEventListener('transitionend', grew);
          };
          panel.addEventListener('transitionend', grew);
        } else {
          // Startwert explizit setzen (deckt auch den vorab geöffneten Zustand ohne Inline-Höhe ab)
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.style.opacity = '1';
          void panel.offsetHeight; // Reflow erzwingen, damit die Transition vom Startwert läuft
          panel.style.maxHeight = '0px';
          panel.style.opacity = '0';
          var shrank = function (e) {
            if (e.propertyName !== 'max-height') return;
            if (!card.classList.contains('open')) panel.hidden = true;
            panel.removeEventListener('transitionend', shrank);
          };
          panel.addEventListener('transitionend', shrank);
        }
      });
    });


    /* ===================== MAIL PROTECT ([data-mail]) ===================== */
    document.querySelectorAll('[data-mail]').forEach(function (el) {
      el.addEventListener('click', function () {
        var url = 'mailto:' + MAIL;
        var subj = el.getAttribute('data-subject');
        if (subj) url += '?subject=' + encodeURIComponent(subj);
        window.location.href = url;
      });
    });

  });


})();
