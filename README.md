# CK Industrial Automation Services – Website

Professionelle Website für das Ingenieurbüro Christoph Korn.

## Deployment auf GitHub Pages

### Schnell-Anleitung

1. **GitHub-Repository erstellen**
   - Gehe auf [github.com/new](https://github.com/new)
   - Repository-Name: z.B. `ck-ias.github.io` (für `username.github.io`) oder `website`
   - Sichtbarkeit: **Public** (für kostenloses GitHub Pages)

2. **Dateien hochladen**
   ```
   08_Marketing/Webpraesenz/
   ├── index.html          ← Hauptseite
   ├── impressum.html      ← Impressum (Pflichtseite)
   ├── datenschutz.html    ← Datenschutzerklärung (Pflichtseite)
   └── img/
       ├── logo_simple_long.png
       └── logo_simple_short.png
   ```

3. **GitHub Pages aktivieren**
   - Repository → Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `main`, Ordner: `/ (root)`
   - Save

4. **Fertig!** Die Website ist erreichbar unter:
   - `https://DEIN-USERNAME.github.io/` (bei Repository-Name `username.github.io`)
   - `https://DEIN-USERNAME.github.io/REPO-NAME/` (bei anderem Repository-Namen)

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

### Lokale Vorschau

Einfach `index.html` im Browser öffnen oder mit einem lokalen Server:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```
