# CK Industrial Automation Services – Website

## Aktivstatus

Dieses Verzeichnis ist die aktive Website-Quelle für das Deployment nach GitHub Pages.

Professionelle Website für CK Industrial Automation Services (Christoph Korn).

## Pflegeprotokoll

| Datum | Änderung |
|-------|----------|
| 31.10.2026 | `index.html` durch die neue Portfolio-Seite ersetzt (eine Datei, Tailwind per CDN, Schrift „Inter“ von Google Fonts). Die bisherige Website ist vollständig gesichert in `08_Marketing/20261031_Backup_Webpraesenz_reloaded/` (siehe `BACKUP_INFO.md` dort). |
| 31.10.2026 | Portfolio-Seite ausgebaut: Inhalte der bisherigen Website übernommen (Angebot, Zahlen, Technik, Über mich, Kontakt, Footer mit Impressum/Datenschutz), neuer Bereich „Typische Anlässe“. Unsplash-Platzhalter durch eigene Bilder ersetzt (u. a. echtes Porträt), tote Links (GitHub/LinkedIn/Twitter `#`) entfernt. Tailwind und Inter jetzt **lokal** (keine Drittanbieter-Verbindungen). Impressum/Datenschutz optisch angeglichen, Hell-Modus entfernt, E-Mail-Fehler (alte lange Adresse im Mail-Skript) behoben, Datenschutzerklärung Abschnitte 5/6 aktualisiert. `styles.css`, `styles-light.css`, `app.js` entfernt (im Backup enthalten). |
| 31.10.2026 | Neue Postanschrift im Bild `img/contact/address.png`; E-Mail-Bild neu (`img/contact/email.png`). Kontaktdaten stehen jetzt **ausschließlich als Bild** auf der Website: keine mailto-Links, kein Mail-Skript, keine PLZ in den strukturierten Daten (JSON-LD). `address_inline.png` und `email_link.png` entfernt. Bei Adress-/Mailänderung nur die beiden Bilder austauschen. |
| 31.10.2026 | Neuer Abschnitt „KI-gestützte Umsetzung“ (`#ki`, Navigation „KI“, Laufband, JSON-LD). **Offen:** Hintergrundfoto aus dem Netz – Download in der Cloud-Umgebung durch die Netzwerk-Richtlinie blockiert (unsplash.com, images.unsplash.com). Geplant: lizenzfreies Foto (Unsplash-Lizenz, kein Unsplash+), lokal als `img/ki_hintergrund.webp` ablegen und im Abschnitt `#ki` als Hintergrund einbinden (Stelle im HTML-Kommentar markiert). |
| 31.10.2026 | Hintergrundbild für `#ki` eingebaut: `img/ki_hintergrund.webp` (KI-Chip, Lila/Blau; von Christoph Korn bereitgestellt, 1600×900, WebP, ohne Metadaten). Layout angepasst: Text links, Chip rechts frei sichtbar, drei Karten als Reihe darunter. Der offene Punkt „Hintergrundfoto“ ist damit erledigt. |
| 01.11.2026 | KI-Abschnitt: Karte „Die CK-IAS App“ (Eigenentwicklung, getestet mit TIA Portal V18). Aussagen nur nach belegtem Stand laut Repo `CK-IAS-APP` (Testprotokoll/Übergabe 08.08.2026): Hardware-Konfiguration und Variablen aus EPLAN-Export in Minuten, Bausteine/OB1 übersetzbar, offline auf dem Engineering-PC. KI-Logikerzeugung ausdrücklich als „in Entwicklung“ gekennzeichnet. Bei neuen Testergebnissen (z. B. V19/V20, Generator) Text anpassen. |
| 01.11.2026 | Ablaufgrafik „So arbeitet die App“ in der CK-IAS-Karte (HTML/Tailwind, responsiv, mit Screenreader-Beschreibung): Backend (EPLAN-Export → Prüfen & zuordnen → Projektdaten) – Air Gap (verschlüsselter Container per Datenträger) – Engineering-PC offline (Lokaler Agent → TIA-Projekt V18), Rückkanal (Firmenstandards, Fehlerbericht), drei Garantien (kein Netzwerk, alles oder nichts, kein F-Code). Quelle: CK-IAS-APP, Installation_und_Bedienung Kap. 1 und 6. Innenabstände im KI-Abschnitt für Handys verringert. |

## Struktur

```
08_Marketing/Webpräsenz reloaded/
├── index.html              ← Hauptseite (Portfolio-Design, SEO, JSON-LD, OG, Twitter Card)
├── impressum.html          ← Impressum (Pflichtseite, CSS inline)
├── datenschutz.html        ← Datenschutzerklärung (Pflichtseite, CSS inline)
├── css/site.css            ← GEBAUT aus 08_Marketing/Website_Build (nicht von Hand ändern!)
├── js/site.js              ← Mobile Navigation, Einblenden, Zähler, E-Mail-Schutz
├── robots.txt              ← Crawler-Steuerung
├── sitemap.xml             ← Sitemap für Suchmaschinen
├── manifest.webmanifest    ← PWA-Manifest
├── fonts/                  ← Lokal gehostete Schrift „Inter“ (DSGVO) + Lizenz (SIL OFL)
│   ├── fonts.css
│   └── inter-latin-wght-normal.woff2
└── img/                    ← Logos, Leistungsbilder, Porträt, Kontakt-Grafiken
```

## CSS ändern / neu bauen

Die Startseite nutzt Tailwind-Klassen. Das CSS wird **lokal gebaut** (kein CDN beim Seitenaufruf):

```bash
cd "08_Marketing/Website_Build"
npm install        # einmalig
npm run build      # erzeugt ../Webpräsenz reloaded/css/site.css
```

Nach jeder Änderung an Klassen in `index.html` oder `js/site.js` neu bauen und `css/site.css` mit committen.
Eigene Stile (Glas-Effekt, Verlaufstext, Laufband …) stehen in `Website_Build/src/input.css`.

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

### Schriftarten (DSGVO)

Die Schrift **Inter** liegt lokal in `fonts/` (Variable Font, Gewichte 100–900, Zeichensatz latin,
Quelle `@fontsource-variable/inter` 5.3.0, Lizenz SIL OFL 1.1). Es wird nichts von Google geladen.

### Lokale Vorschau

Einfach `index.html` im Browser öffnen oder mit einem lokalen Server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```


---

## Termin-Kalender (deaktiviert)

Der frühere Online-Buchungskalender wurde bewusst entfernt: Einzige Kontaktmöglichkeit
ist der Bereich **Kontakt** (E-Mail). Die zugehörige Logik wurde aus der Website und der
Datenschutzerklärung entfernt. Falls der Kalender später
wieder gewünscht ist, liegt der alte Stand im Projektarchiv (Marketing.7z) – oder ein
Dienst wie Cal.com/Calendly lässt sich im Kontakt-Bereich einbetten.
