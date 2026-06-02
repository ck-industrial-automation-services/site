/* ============================================================
   CK Industrial Automation Services — app.js
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     ▼▼▼  TERMIN-KALENDER: HIER KONFIGURIEREN  ▼▼▼
     ------------------------------------------------------------
     Alles, was Christoph anpassen muss, steht in diesem Block.
     ------------------------------------------------------------ */
  var BOOKING = {
    // Dauer eines Termins in Minuten (max. 15 wie gewünscht):
    slotMinutes: 15,

    // Wie viele Stunden im Voraus muss mindestens gebucht werden?
    leadHours: 12,

    // Wie weit in die Zukunft darf gebucht werden? (in Tagen)
    horizonDays: 28,

    // Verfügbare Zeitfenster je Wochentag.
    //   0 = Sonntag, 1 = Montag, 2 = Dienstag, ... 6 = Samstag
    //   Pro Tag beliebig viele Fenster ["Start","Ende"] im Format "HH:MM" (24h).
    //   Leeres Array [] = an diesem Tag keine Termine.
    hours: {
      0: [],                                   // Sonntag
      1: [['17:00', '20:00']],                 // Montag
      2: [['17:00', '20:00']],                 // Dienstag
      3: [['17:00', '20:00']],                 // Mittwoch
      4: [['17:00', '20:00']],                 // Donnerstag
      5: [['16:00', '19:00']],                 // Freitag
      6: [['10:00', '13:00']]                  // Samstag
    },

    // Einzelne Tage komplett sperren (Urlaub, Feiertage) – Format "YYYY-MM-DD":
    blackoutDates: ['2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01'],

    // Bereits vergebene Einzel-Slots ausblenden – Format "YYYY-MM-DDTHH:MM":
    bookedSlots: [],

    // Anzeigetext der Zeitzone (rein informativ):
    timezoneLabel: 'Europe/Berlin'
  };
  /* ▲▲▲  ENDE KONFIGURATION  ▲▲▲ */


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
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
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
      var words = ['SPS-Steuerungen', 'Web & Skripte', 'IIoT-Lösungen', 'Maschinendaten'];
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
    document.querySelectorAll('.offer-toggle').forEach(function (btn) {
      var card = btn.closest('.offer-card');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          panel.hidden = false;
          panel.style.maxHeight = '0px';
          requestAnimationFrame(function () {
            panel.style.transition = 'max-height .4s ease, opacity .4s ease';
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.opacity = '1';
          });
        } else {
          panel.style.maxHeight = '0px';
          panel.style.opacity = '0';
          var done = function () { panel.hidden = true; panel.removeEventListener('transitionend', done); };
          panel.addEventListener('transitionend', done);
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


    /* ===================== BOOKING CALENDAR ===================== */
    initBooker();
  });


  /* ============================================================
     BOOKING CALENDAR LOGIC
     ============================================================ */
  function initBooker() {
    var dayList = document.getElementById('dayList');
    if (!dayList) return;
    var slotList = document.getElementById('slotList');
    var slotDayLabel = document.getElementById('slotDayLabel');
    var formWrap = document.getElementById('formWrap');
    var formPlaceholder = document.getElementById('formPlaceholder');
    var chosenSlot = document.getElementById('chosenSlot');
    var bookedSuccess = document.getElementById('bookedSuccess');
    var successWhen = document.getElementById('successWhen');
    var nameI = document.getElementById('bkName');
    var mailI = document.getElementById('bkMail');
    var topicI = document.getElementById('bkTopic');
    var formError = document.getElementById('formError');
    var confirmBtn = document.getElementById('confirmBtn');
    var mailBtn = document.getElementById('mailBtn');
    var gcalBtn = document.getElementById('gcalBtn');
    var icsBtn = document.getElementById('icsBtn');
    var resetBtn = document.getElementById('resetBtn');

    var DOW_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    var DOW_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    var MONTHS = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var isoDay = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var isoMin = function (d) { return isoDay(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    var stamp = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00'; };
    var hhmm = function (d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); };

    var bookedSet = {};
    (BOOKING.bookedSlots || []).forEach(function (s) { bookedSet[s] = true; });
    var blackout = {};
    (BOOKING.blackoutDates || []).forEach(function (s) { blackout[s] = true; });

    var now = new Date();
    var earliest = new Date(now.getTime() + BOOKING.leadHours * 3600000);

    function slotsForDay(d) {
      var windows = BOOKING.hours[d.getDay()] || [];
      var out = [];
      windows.forEach(function (w) {
        var s = w[0].split(':'), e = w[1].split(':');
        var cur = new Date(d); cur.setHours(+s[0], +s[1], 0, 0);
        var end = new Date(d); end.setHours(+e[0], +e[1], 0, 0);
        while (cur.getTime() + BOOKING.slotMinutes * 60000 <= end.getTime()) {
          var slot = new Date(cur);
          if (slot.getTime() >= earliest.getTime() && !bookedSet[isoMin(slot)]) out.push(slot);
          cur = new Date(cur.getTime() + BOOKING.slotMinutes * 60000);
        }
      });
      return out;
    }

    // Build list of bookable days
    var days = [];
    var base = new Date(); base.setHours(0, 0, 0, 0);
    for (var i = 0; i <= BOOKING.horizonDays; i++) {
      var d = new Date(base.getTime() + i * 86400000);
      if (blackout[isoDay(d)]) continue;
      var slots = slotsForDay(d);
      if (slots.length) days.push({ date: d, slots: slots });
    }

    var selectedSlot = null;

    if (!days.length) {
      dayList.innerHTML = '<p class="slot-empty">Aktuell sind online keine Termine frei. Bitte schreiben Sie mir kurz eine E-Mail – wir finden einen Termin.</p>';
      slotList.innerHTML = '';
      slotDayLabel.textContent = '';
      return;
    }

    // Render day buttons
    days.forEach(function (day, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-btn';
      btn.setAttribute('data-idx', idx);
      btn.innerHTML =
        '<span class="d-dow">' + DOW_SHORT[day.date.getDay()] + ', ' + day.date.getDate() + '. ' + MONTHS[day.date.getMonth()] + '</span>' +
        '<span class="d-date">' + day.slots.length + ' frei</span>';
      btn.addEventListener('click', function () { selectDay(idx); });
      dayList.appendChild(btn);
    });

    function selectDay(idx) {
      selectedSlot = null;
      resetToForm();
      formWrap.classList.remove('show'); formWrap.setAttribute('aria-hidden', 'true');
      formPlaceholder.classList.remove('hide');
      Array.prototype.forEach.call(dayList.children, function (c) {
        if (c.classList) c.classList.toggle('active', c.getAttribute('data-idx') == idx);
      });
      var day = days[idx];
      slotDayLabel.textContent = DOW_LONG[day.date.getDay()] + ', ' + day.date.getDate() + '. ' + MONTHS[day.date.getMonth()];
      slotList.innerHTML = '';
      day.slots.forEach(function (slot) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot-btn';
        b.textContent = hhmm(slot);
        b.addEventListener('click', function () { selectSlot(slot, b); });
        slotList.appendChild(b);
      });
    }

    function selectSlot(slot, btn) {
      selectedSlot = slot;
      Array.prototype.forEach.call(slotList.children, function (c) {
        if (c.classList) c.classList.remove('active');
      });
      btn.classList.add('active');
      // reveal form
      bookedSuccess.hidden = true;
      formPlaceholder.classList.add('hide');
      formWrap.classList.add('show');
      formWrap.setAttribute('aria-hidden', 'false');
      chosenSlot.innerHTML = '📅 ' + whenText(slot);
      formError.hidden = true;
    }

    function whenText(start) {
      var end = new Date(start.getTime() + BOOKING.slotMinutes * 60000);
      return DOW_SHORT[start.getDay()] + ', ' + start.getDate() + '. ' + MONTHS[start.getMonth()] + ' ' + start.getFullYear() +
        ' · ' + hhmm(start) + '–' + hhmm(end) + ' Uhr';
    }

    function resetToForm() {
      bookedSuccess.hidden = true;
    }

    confirmBtn.addEventListener('click', function () {
      var name = (nameI.value || '').trim();
      var mail = (mailI.value || '').trim();
      var topic = (topicI.value || '').trim();
      if (!name) { showErr('Bitte geben Sie Ihren Namen an.'); nameI.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { showErr('Bitte geben Sie eine gültige E-Mail-Adresse an.'); mailI.focus(); return; }
      if (!selectedSlot) { showErr('Bitte wählen Sie zuerst eine Uhrzeit.'); return; }
      formError.hidden = true;

      var start = selectedSlot;
      var end = new Date(start.getTime() + BOOKING.slotMinutes * 60000);
      var title = '15-Min-Kennenlernen: ' + name + ' × CK Industrial Automation Services';
      var desc =
        'Kostenloses 15-minütiges Kennenlernen mit Christoph Korn (CK Industrial Automation Services).%0A%0A' +
        'Name: ' + enc(name) + '%0A' +
        'E-Mail: ' + enc(mail) + '%0A' +
        'Thema: ' + enc(topic || '—') + '%0A%0A' +
        'Hinweis: Bitte sehen Sie die Bestätigung per E-Mail von Christoph ab.';

      // Google Calendar
      var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + enc(title) +
        '&dates=' + stamp(start) + '/' + stamp(end) +
        '&ctz=' + enc(BOOKING.timezoneLabel) +
        '&details=' + desc +
        '&location=' + enc('Online / Telefon');
      gcalBtn.href = g;

      // mailto to Christoph
      var subj = 'Terminanfrage 15 Min – ' + start.getDate() + '. ' + MONTHS[start.getMonth()] + ' ' + hhmm(start) + ' Uhr';
      var body =
        'Hallo Christoph,%0A%0A' +
        'ich möchte gern ein 15-Minuten-Kennenlernen buchen:%0A%0A' +
        'Wunschtermin: ' + enc(whenText(start)) + ' (' + enc(BOOKING.timezoneLabel) + ')%0A' +
        'Name: ' + enc(name) + '%0A' +
        'E-Mail: ' + enc(mail) + '%0A' +
        'Thema: ' + enc(topic || '—') + '%0A%0A' +
        'Viele Grüße%0A' + enc(name);
      mailBtn.href = 'mailto:' + MAIL + '?subject=' + enc(subj) + '&body=' + body;

      // ICS download
      icsBtn.onclick = function () { downloadICS(start, end, title, name, mail, topic); };

      successWhen.textContent = whenText(start);
      formWrap.classList.remove('show');
      formWrap.setAttribute('aria-hidden', 'true');
      formPlaceholder.classList.add('hide');
      bookedSuccess.hidden = false;
      bookedSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    resetBtn.addEventListener('click', function () {
      bookedSuccess.hidden = true;
      formWrap.classList.remove('show');
      formWrap.setAttribute('aria-hidden', 'true');
      formPlaceholder.classList.remove('hide');
      Array.prototype.forEach.call(slotList.children, function (c) { if (c.classList) c.classList.remove('active'); });
      selectedSlot = null;
      slotList.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    function showErr(msg) { formError.textContent = msg; formError.hidden = false; }
    function enc(s) { return encodeURIComponent(s); }

    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function icsStamp(d) { // floating local time
      return d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + 'T' +
        pad2(d.getHours()) + pad2(d.getMinutes()) + '00';
    }
    function icsUTC(d) {
      return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + 'T' +
        pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + pad2(d.getUTCSeconds()) + 'Z';
    }
    function esc(s) { return (s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); }

    function downloadICS(start, end, title, name, mail, topic) {
      var uid = 'ckias-' + start.getTime() + '@ck-industrial-automation-services';
      var desc = 'Kostenloses 15-Minuten-Kennenlernen mit Christoph Korn.\n' +
        'Name: ' + name + '\nE-Mail: ' + mail + '\nThema: ' + (topic || '—') +
        '\n\nBitte Bestätigung per E-Mail abwarten.';
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//CK Industrial Automation Services//Termin//DE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:' + uid,
        'DTSTAMP:' + icsUTC(new Date()),
        'DTSTART:' + icsStamp(start),
        'DTEND:' + icsStamp(end),
        'SUMMARY:' + esc(title),
        'DESCRIPTION:' + esc(desc),
        'LOCATION:Online / Telefon',
        'ORGANIZER;CN=Christoph Korn:mailto:' + MAIL,
        'STATUS:TENTATIVE',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Termin_CK-IAS.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    }

    // Auto-select first available day for a smooth start
    selectDay(0);
  }
})();
