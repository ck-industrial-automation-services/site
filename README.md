# CK Industrial Automation Services – Website

Professionelle Website für das Ingenieurbüro Christoph Korn.

## Struktur

```
08_Marketing/Webpraesenz/
├── index.html              ← Hauptseite (SEO, JSON-LD, OG, Twitter Card)
├── impressum.html          ← Impressum (Pflichtseite)
├── datenschutz.html        ← Datenschutzerklärung (Pflichtseite)
├── styles.css              ← Ausgelagerter CSS (cacheable)
├── app.js                  ← Ausgelagerter JS (rAF-Scheduler, A11y)
├── robots.txt              ← Crawler-Steuerung
├── sitemap.xml             ← Sitemap für Suchmaschinen
├── manifest.webmanifest    ← PWA-Manifest
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
   Alle Dateien aus `08_Marketing/Webpraesenz/` in das Pages-Repo (Root) kopieren.

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

### Lokale Vorschau

Einfach `index.html` im Browser öffnen oder mit einem lokalen Server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

