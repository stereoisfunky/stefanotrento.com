# stefanotrento.com

Personal portfolio of Stefano Trento — product designer.
Vanilla HTML, CSS, and JavaScript. No build tools, no framework, no dependencies. no tracking.

---

## Running locally

```bash
npx serve .
```

Open at `http://localhost:3000`. Requires Node.js for `serve`.

---

## File structure

```
├── index.html                  Main page shell (static, no content hardcoded)
├── impressum.html              Legal page (German TMG)
│
├── css/
│   └── style.css               Single stylesheet — all tokens, components, responsive
│
├── js/
│   ├── render.js               Fetches JSON, builds all DOM content dynamically
│   ├── main.js                 Initialises cursor, scroll observer, bg music toggle
│   ├── wave.js                 WaveGrid canvas (arrival) + FreqCanvas (investigation 003)
│   └── player.js               Simulated audio player (waveform + click-to-seek)
│
├── content/
│   ├── about.json              About section — bio, body paragraphs, timeline entries
│   ├── investigations.json     The three investigations — questions, annotations, visuals
│   └── present.json            Present section — year groups, seasons, objects, tracks
│
├── assets/
│   ├── fonts/                  PP Neue Machina — see Typeface section below
│   ├── img/                    Favicons (favicon.ico, favicon-32x32.png, apple-touch-icon.png)
│   ├── helloblueplanet.mp3     Background ambient track (arrival section)
│   └── CV26-stefano-trento.pdf CV linked from contact section
│
├── .htaccess                   Apache config — HTTPS redirect, cache, security headers
├── robots.txt                  Blocks AI training crawlers
└── llms.txt                    AI-readable site description
```

---

## Where to make changes

### Text content
All content lives in `content/`. No HTML editing needed for copy changes.

| What | File |
|---|---|
| Bio, body paragraphs, timeline entries | `content/about.json` |
| Investigation questions and annotations | `content/investigations.json` |
| Present section — seasons, listening, objects | `content/present.json` |
| Contact email, external links | `index.html` — lines 114–123 |
| Legal information | `impressum.html` |

### Colours
Defined as CSS custom properties at the top of `css/style.css`:

```css
:root {
  --black:       #121212;
  --white:       #FAFAFA;
  --grey-light:  #EDEDED;
  --grey-mid:    #9A9A9A;
  --grey-dark:   #2a2a2a;
  --signal:      #FF2F00;   /* accent — used sparingly */
  --present-bg:  #0d0d0d;
}
```

### Responsive breakpoints
`css/style.css` is organised bottom-up: base styles first, then breakpoints at the end.

- `@media (max-width: 1024px) and (min-width: 769px)` — tablet
- `@media (max-width: 768px)` — mobile
- `@media (max-width: 480px)` — small mobile

### Background music
Replace `assets/helloblueplanet.mp3` with any mp3. The `<audio>` element is in `index.html` line 48.

### CV
Replace `assets/CV26-stefano-trento.pdf`. The filename is referenced in `index.html` line 122.

---

## Adding content

### New investigation
Add an object to `content/investigations.json`. Fields:

```json
{
  "id": "inv-4",
  "number": "Investigation",
  "visual": "redacted",        // "redacted" | "navigation" | "frequency"
  "visual_left": false,        // optional — puts visual on left column
  "question_history": [
    { "year": "2020", "text": "The question as it was." },
    { "year": "2026", "text": "How it evolved.", "current": true }
  ],
  "annotations": [
    { "date": "2020", "label": "Origin", "current": false, "text": "..." },
    { "date": "2026", "label": "Still open", "current": true, "text": "..." }
  ],
  "craft_callout": "Optional closing reflection."
}
```

A new `<section>` and progress dot also need to be added manually in `index.html` and `js/main.js`.

### New present season
Add a season object inside the relevant year in `content/present.json`:

```json
{
  "season": "Spring",
  "question": "What are you working on?",
  "answer": "...",
  "objects": [
    { "label": "Context", "value": "..." }
  ],
  "track": {
    "bandcamp_id": "123456789"
  }
}
```

If `bandcamp_id` is set, a Bandcamp embed is shown. If `null`, the visual waveform player is shown instead (requires `title`, `artist`, `label`, `url`, `duration_display`, `duration_seconds`).

---

## Typeface

The site uses **PP Neue Machina Inktrap Ultrabold** by Pangram Pangram for labels and headings (text-transform: uppercase). This is a **commercial font and is not included in this repository**.

To run the site with this typeface:

1. Purchase the font at [pangram-pangram.com](https://pangram-pangram.com)
2. Place `PPNeueMachina-InktrapUltrabold.woff2` in `assets/fonts/`
3. Run the subset command to generate the optimised file used in production:

```bash
pip install fonttools brotli

pyftsubset \
  "assets/fonts/PPNeueMachina-InktrapUltrabold.woff2" \
  --output-file="assets/fonts/PPNeueMachina-subset.woff2" \
  --flavor=woff2 \
  --layout-features="*" \
  --text="ABCDEFGHIJKLMNOPQRSTUVWXYZ .?" \
  --unicodes="U+2018,U+2019"
```

To use a different typeface, update the `@font-face` block and the font-family references in `css/style.css`. The font is only used on elements with class `section-label`, `listen`, `inv-number`, `season-question`, `tl-section-label`, and `tl-label`.

---

## Deployment

Static files, upload everything to the web root via FTP or file manager.
The `.htaccess` requires Apache with `mod_rewrite`, `mod_headers`, and `mod_deflate` — standard on shared hosting.
SSL certificate must be activated separately on the hosting panel (the `.htaccess` redirect assumes HTTPS is already available).
