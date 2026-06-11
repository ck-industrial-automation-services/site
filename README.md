# CK Industrial Automation Services – Website

## Aktivstatus

Dieses Verzeichnis ist die aktive Website-Quelle für das Deployment nach GitHub Pages.

Professionelle Website für CK Industrial Automation Services (Christoph Korn).

## Struktur

```
08_Marketing/Webpräsenz reloaded/
├── index.html              ← Hauptseite (SEO, JSON-LD, OG, Twitter Card)
├── impressum.html          ← Impressum (Pflichtseite)
├── datenschutz.html        ← Datenschutzerklärung (Pflichtseite)
├── styles.css              ← Ausgelagerter CSS (cacheable)
├── app.js                  ← Ausgelagerter JS (rAF-Scheduler, A11y)
├── robots.txt              ← Crawler-Steuerung
├── sitemap.xml             ← Sitemap für Suchmaschinen
├── manifest.webmanifest    ← PWA-Manifest
├── fonts/                  ← Lokal gehostete Schriftarten (DSGVO)
│   └── fonts.css           ← @font-face-Definitionen (WOFF2-Dateien ergänzen!)
└── img/
    ├── logo_simple_long.webp
    ├── logo_simple_short.webp
    └── …
```

## Deployment auf GitHub Pages

### Schnell-Anleitung

1. **GitHub-Repository erstellen**
   - Gehe auf [github.com/new](https://github.com/new)
   - Repository-Name: z.B. `ck-ias.github.io` (für `username.github.io`) oder `website`
   - Sichtbarkeit: **Public** (für kostenloses GitHub Pages)

2. **Dateien hochladen**
   Alle Dateien aus `08_Marketing/Webpräsenz reloaded/` in das Pages-Repo (Root) kopieren.

3. **GitHub Pages aktivieren**
   - Repository → Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `main`, Ordner: `/ (root)`
   - Save

4. **Fertig!** Die Website ist erreichbar unter:
   - `https://DEIN-USERNAME.github.io/` (bei Repository-Name `username.github.io`)
   - `https://DEIN-USERNAME.github.io/REPO-NAME/` (bei anderem Repository-Namen)

> **Hinweis:** In diesem Repo existiert der Workflow `.github/workflows/sync-to-pages.yml`,
> der dieses Unterverzeichnis automatisch in das Pages-Ziel-Repo
> `ck-industrial-automation-services/site` pusht.

### Eigene Domain (optional)

Falls du eine eigene Domain nutzen möchtest (z.B. `ck-ias.de`):

1. Domain beim Anbieter registrieren
2. DNS konfigurieren:
   - CNAME Record: `www` → `DEIN-USERNAME.github.io`
   - A Records für Apex-Domain:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
3. In GitHub: Settings → Pages → Custom domain eintragen
4. HTTPS erzwingen aktivieren
5. **Absolute URLs anpassen** in:
   - `index.html` (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`/`@id`/`image`)
   - `robots.txt` (`Sitemap:`-Zeile)
   - `sitemap.xml` (alle `<loc>`-Einträge)

### Schriftarten lokal einbinden (DSGVO – einmalig erledigen!)

Die Seiten laden Schriftarten **nicht mehr von Google**, sondern aus `fonts/fonts.css`.
Damit die Original-Schriften (statt des System-Fallbacks) angezeigt werden, müssen die
WOFF2-Dateien einmalig heruntergeladen und in den Ordner `fonts/` gelegt werden:

1. https://gwfh.mranftl.com (google-webfonts-helper) öffnen
2. **Sora** auswählen → Charset `latin`, Styles `500, 600, 700, 800` → "Modern Browsers" → Download
3. **IBM Plex Sans** → `latin`, Styles `regular, 500, 600` → Download
4. **IBM Plex Mono** → `latin`, Style `500` → Download
5. Die `.woff2`-Dateien in `fonts/` ablegen. Erwartete Dateinamen (ggf. umbenennen):
   `sora-v12-latin-500.woff2`, `-600`, `-700`, `-800`,
   `ibm-plex-sans-v19-latin-regular.woff2`, `-500`, `-600`,
   `ibm-plex-mono-v19-latin-500.woff2`
   (Abweichende Versionsnummern im Dateinamen? Dann die `url(...)`-Einträge in `fonts/fonts.css` anpassen.)
6. Lokal prüfen (siehe unten) und deployen.

> Bis die Dateien vorliegen, fällt die Seite automatisch auf Systemschriften zurück –
> sie bleibt voll funktionsfähig, sieht nur typografisch etwas anders aus.

### Lokale Vorschau

Einfach `index.html` im Browser öffnen oder mit einem lokalen Server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```


---

## Termin-Kalender konfigurieren

Der Buchungskalender läuft vollständig im Browser (keine Server-/Backend-Logik nötig – passt also zu GitHub Pages). Alle Einstellungen stehen oben in **`app.js`** im Block `BOOKING`:

```js
var BOOKING = {
  slotMinutes: 15,        // Dauer pro Termin in Minuten (max. 15)
  leadHours: 12,          // Mindest-Vorlauf in Stunden
  horizonDays: 28,        // Wie weit in die Zukunft buchbar (Tage)

  hours: {                // Verfügbare Zeitfenster je Wochentag
    0: [],                                  // So – keine Termine
    1: [['17:00', '20:00']],                // Mo
    2: [['17:00', '20:00']],                // Di
    3: [['17:00', '20:00']],                // Mi
    4: [['17:00', '20:00']],                // Do
    5: [['16:00', '19:00']],                // Fr
    6: [['10:00', '13:00']]                 // Sa
  },

  blackoutDates: ['2026-12-24', '2026-12-25'],   // ganze Tage sperren (Urlaub/Feiertage), "YYYY-MM-DD"
  bookedSlots:   ['2026-06-10T17:30'],           // einzelne, bereits vergebene Slots ausblenden, "YYYY-MM-DDTHH:MM"
  timezoneLabel: 'Europe/Berlin'                 // nur Anzeigetext
};
```

**So passt du es an:**

- **Andere Zeiten?** Werte in `hours` ändern. Mehrere Fenster pro Tag sind möglich, z. B. `4: [['09:00','11:00'], ['17:00','20:00']]`.
- **Tag komplett frei lassen?** Leeres Array, z. B. `6: []` für keinen Samstag.
- **Urlaub / Feiertage?** Datum in `blackoutDates` eintragen.
- **Slot schon vergeben?** In `bookedSlots` eintragen – dann ist genau diese Uhrzeit nicht mehr wählbar.
- **Terminlänge?** `slotMinutes` (z. B. `10`). Die 15 Minuten sind bereits das gewünschte Maximum.

Nach dem Bestätigen bekommt der Kunde drei Buttons: **Anfrage per E-Mail senden** (mailto an dich, mit allen Daten), **Zu Google Kalender hinzufügen** und **.ics-Datei herunterladen**.

> **Hinweis zur statischen Variante:** Da es keinen Server gibt, werden bereits gebuchte Termine **nicht automatisch** ausgeblendet – du trägst sie kurz in `bookedSlots` nach. Wenn du echte Zwei-Wege-Synchronisierung (Slot fällt nach Buchung automatisch weg, Bestätigung ohne manuelles Zutun) möchtest, lässt sich an dieser Stelle problemlos ein Dienst wie **Cal.com** oder **Calendly** einbetten.
