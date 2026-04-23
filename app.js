/* CK Industrial Automation Services – Website JS
 * - Mobile menu toggle with aria-expanded + ESC support
 * - Nav logo/brand flash when hero leaves viewport
 * - 3D scroll-lock wheels (single rAF-scheduled scroll listener)
 * - Respects prefers-reduced-motion: wheels render as static list (CSS does the layout)
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Mobile navigation ===== */
  (function initNav() {
    var navLinksEl = document.getElementById('navLinks');
    var toggle     = document.querySelector('.nav-toggle');
    if (!navLinksEl || !toggle) return;

    function setOpen(open) {
      navLinksEl.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.setAttribute('aria-controls', 'navLinks');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      setOpen(!navLinksEl.classList.contains('open'));
    });

    // Close menu on link click
    navLinksEl.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  })();

  /* ===== Hero logo → Nav logo flash ===== */
  (function initNavLogoFlash() {
    var heroLogo  = document.querySelector('.hero-logo');
    var navLogo   = document.querySelector('.nav-logo');
    var brandText = document.querySelector('.nav-brand-text');
    if (!heroLogo || !navLogo) return;

    var shown = false;
    var observer = new IntersectionObserver(function (entries) {
      var isVisible = entries[0].isIntersecting;
      if (!isVisible && !shown) {
        navLogo.classList.add('visible');
        if (brandText) brandText.classList.add('visible');
        shown = true;
      } else if (isVisible && shown) {
        navLogo.classList.remove('visible');
        if (brandText) brandText.classList.remove('visible');
        shown = false;
      }
    }, { threshold: 0.1 });
    observer.observe(heroLogo);
  })();

  /* ===== 3D Scroll-Lock Wheel Engine =====
   * All wheels share ONE scroll listener, throttled via requestAnimationFrame.
   */
  (function initWheels() {
    var SCROLL_PER_DEG = 400 / 45;          // px of scroll per degree of rotation
    var DWELL_PX       = 250;               // dead-zone buffer entry + exit

    var configs = [
      { id: 'probleme', ringId: 'problemeRing', detailId: 'problemeDetail', dotsId: 'problemeDots', progressId: 'problemeProgress', radius: 300, label: 'Ihre Situation' },
      { id: 'services', ringId: 'servicesRing', detailId: 'servicesDetail', dotsId: 'servicesDots', progressId: 'servicesProgress', radius: 500, label: 'Leistung', minScrollPerItem: 450 },
      { id: 'tech',     ringId: 'techRing',     detailId: 'techDetail',     dotsId: 'techDots',     progressId: 'techProgress',     radius: 300, label: 'Technologie' },
      { id: 'branchen', ringId: 'branchenRing', detailId: 'branchenDetail', dotsId: 'branchenDots', progressId: 'branchenProgress', radius: 280, label: 'Branche' }
    ];

    var wheels = configs
      .map(function (cfg) { return createWheel(cfg); })
      .filter(Boolean);

    if (!wheels.length) return;

    // In reduced-motion mode CSS already renders items as a grid — skip all
    // scroll math and 3D transforms entirely.
    if (prefersReducedMotion) return;

    function renderAll() {
      for (var i = 0; i < wheels.length; i++) wheels[i].update();
    }
    function handleResize() {
      for (var i = 0; i < wheels.length; i++) wheels[i].resize();
      renderAll();
    }

    var scheduled = false;
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        renderAll();
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    renderAll();

    function createWheel(cfg) {
      var section = document.querySelector('[data-wheel-id="' + cfg.id + '"]');
      var ring    = document.getElementById(cfg.ringId);
      var detail  = document.getElementById(cfg.detailId);
      var dots    = document.getElementById(cfg.dotsId);
      var progress = document.getElementById(cfg.progressId);
      if (!section || !ring) return null;

      var items     = ring.querySelectorAll('.wheel-item');
      var n         = items.length;
      if (!n) return null;
      var angleStep = 360 / n;
      var radius    = cfg.radius || 280;
      var scrollPerItem = angleStep * SCROLL_PER_DEG;
      if (cfg.minScrollPerItem) scrollPerItem = Math.max(cfg.minScrollPerItem, scrollPerItem);

      var totalScroll = 0;

      function layout() {
        // Section height: entry dwell + travel + exit dwell + one viewport
        totalScroll = (n - 1) * scrollPerItem;
        if (prefersReducedMotion) {
          section.style.height = '';
          return;
        }
        var totalHeight = DWELL_PX + totalScroll + DWELL_PX + window.innerHeight;
        section.style.height = totalHeight + 'px';
      }

      // Initial 3D position
      if (!prefersReducedMotion) {
        items.forEach(function (item, i) {
          item.style.transform = 'rotateX(' + (i * angleStep) + 'deg) translateZ(' + radius + 'px)';
        });
      }

      // Dots (accessibility: meaningful labels from data-title)
      if (dots) {
        dots.innerHTML = '';
        for (var i = 0; i < n; i++) {
          var title = items[i].getAttribute('data-title') || ('Item ' + (i + 1));
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'wheel-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', cfg.label + ': ' + title);
          dots.appendChild(dot);
        }
      }

      layout();

      function render(scrollProgress) {
        var clamped = Math.max(0, Math.min(1, scrollProgress));
        var currentAngle = -clamped * (n - 1) * angleStep;
        var currentIndex = Math.round(clamped * (n - 1));

        ring.style.transform = 'rotateX(' + currentAngle + 'deg)';

        items.forEach(function (item, i) {
          var itemAngle = ((i * angleStep + currentAngle) % 360 + 360) % 360;
          var dist = Math.min(itemAngle, 360 - itemAngle);
          var distNorm = dist / 180;

          if (i === currentIndex) {
            item.classList.add('active');
            item.style.filter = 'none';
            item.style.opacity = '1';
          } else {
            item.classList.remove('active');
            var blur = Math.min(distNorm * 4, 3);
            var glow = Math.max(0.2, 1 - distNorm);
            item.style.filter = 'blur(' + blur.toFixed(1) + 'px) drop-shadow(0 0 ' +
              (15 * glow).toFixed(0) + 'px rgba(34,211,238,' + (glow * 0.4).toFixed(2) + '))';
            item.style.opacity = String(Math.max(0.3, 1 - distNorm * 0.8));
          }
        });

        if (detail && items[currentIndex]) {
          var it = items[currentIndex];
          var h3 = detail.querySelector('h3');
          var p  = detail.querySelector('p');
          if (h3) h3.textContent = it.getAttribute('data-title') || '';
          if (p)  p.textContent  = it.getAttribute('data-desc')  || '';
          detail.classList.add('visible');
        }

        if (dots) {
          var dotEls = dots.querySelectorAll('.wheel-dot');
          dotEls.forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
          });
        }

        if (progress) {
          progress.style.width = (clamped * 100).toFixed(1) + '%';
        }
      }

      function update() {
        var rect = section.getBoundingClientRect();
        var rawScroll = -rect.top;
        var activeScroll = rawScroll - DWELL_PX;
        var scrollProgress = totalScroll > 0 ? activeScroll / totalScroll : 0;
        render(scrollProgress);
      }

      return { update: update, resize: layout };
    }
  })();

  /* ===== Mail-Schutz =====
   * Die E-Mail-Adresse wird erst im Browser zusammengesetzt, damit sie
   * nicht im HTML-Quelltext steht (Schutz vor Crawlern/Spam-Bots).
   * Elemente mit [data-mail] öffnen beim Klick `mailto:` mit optionalem
   * [data-subject].
   */
  (function initMailProtect() {
    var u = ['christoph', '.', 'korn'].join('');
    var d = ['paderborn', '.', 'com'].join('');
    var mail = u + '\u0040' + d;
    document.querySelectorAll('[data-mail]').forEach(function (el) {
      el.addEventListener('click', function () {
        var url = 'mailto:' + mail;
        var subj = el.getAttribute('data-subject');
        if (subj) url += '?subject=' + encodeURIComponent(subj);
        window.location.href = url;
      });
    });
  })();
})();
