# Mohamed Marou Belko - Electrical Engineering Portfolio

This repository contains a multi-page static electrical engineering portfolio
built for GitHub Pages.

Public portfolio: https://mohamedblko.github.io/portfolio/

- French: https://mohamedblko.github.io/portfolio/?lang=fr
- English: https://mohamedblko.github.io/portfolio/?lang=en

## Sections

- `index.html` - recruiter-focused 3D homepage
- `about.html` - profile, degree, location, languages, mobility
- `skills.html` - technical skills by engineering domain
- `projects.html` - interactive engineering case studies
- `process.html` - engineering workflow
- `timeline.html` - experience, education and readiness
- `contact.html` - contact details, resume and a contact form submitted through Formspree
- `project-*.html` - 19 separate project, laboratory and experience case studies
- `case-study.css`, `case-study.js` - scoped case-study layouts, image viewer and illustrative controls
- `i18n.js`, `translations.js`, `locales/` - English/French copy, persistent language selection and bilingual search

Project media in `assets/projects/` are a reviewed selection, not a copy of the
private project archive. All five video clips are silent. Raw academic reports,
personal identifiers and confidential client materials are not included in this selection.
Saved plots are not live simulations; code downloads are labeled excerpts.

## How to customize

Edit the corresponding HTML page for profile and contact information. The project
catalog and 16 additional case studies are generated from `case-studies.json`
and `assets/projects/media-index.json` with:

```sh
node scripts/build-case-studies.mjs
node scripts/build-translations.mjs
python scripts/prepare-site.py
node scripts/check-case-studies.mjs
node scripts/test-portfolio.mjs
python scripts/audit-portfolio.py
```

The three original authored case studies retain their interactive demonstrations;
only their marked archive gallery blocks are regenerated. To update a case, include:

- objective
- responsibilities
- software
- measurable result
- gallery assets
- report, drawing, simulation, or demo link

The Python preparation/audit scripts require `lxml`. Run preparation after the
case-study builder; it normalizes shared navigation, footers and language controls.
`translations.js` is generated. Edit `locales/fr.json`, `locales/media.fr.json` and
`locales/case-studies.fr.json` rather than editing the bundle. Add new copy to the
translation files; the audit flags uncovered English content.

The visual theme is driven by `styles.css` and `script.js`: dark electrical
engineering colors, steel accents, orange highlights, a Three.js 3D homepage
power hub, separate project pages, searchable categories and expandable galleries. The
resume PDF is stored in `assets/`.

## Evidence and privacy

The catalog distinguishes prototypes, completed coursework, preparatory work,
reference handouts and professional overviews. Saved plots are not rerun simulations.
Extracted PDF figures omit cover pages, student identifiers and grading material.
Confidential power-supply work and Hydro-Quebec experience use only high-level
text and illustrative workflows: no confidential architecture, photos, reports,
internal screenshots or datasets. Code excerpts are labeled with their assumptions.
Intercom, FM radio, RFID and Shopify studio cases are not fabricated when their
supporting files cannot be identified in the available archive.

## Run locally

Open `index.html` in a browser.

The FR/EN control works without a server. It keeps the selection in local storage
when available and carries `?lang=fr` or `?lang=en` across local page links.
French project summaries are downloaded as `engineering-notes.fr.md`; original
source figures and code are not altered. The existing resume is English and its
link is labeled accordingly. No visitor message is sent during automated tests.

## Deploy on GitHub Pages

After pushing to GitHub:

1. Go to the repository settings.
2. Open **Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`.
5. Save.

GitHub will publish the portfolio automatically.
