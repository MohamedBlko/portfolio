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

### One-command preparation

After editing, press **Ctrl+Shift+B** in VS Code to run **Portfolio: generate and check**.
You can also use **Terminal > Run Build Task**, or run this from the repository root:

```sh
node scripts/prepare-portfolio.mjs
```

This runs the eight generation/check commands below, in order, and stops on the
first failure. It checks for Python 3 with `lxml` before modifying generated files.
Install that dependency once with `py -3 -m pip install --user lxml` on Windows
(or use `python3`/`python` as appropriate). A custom Python executable can be set
using the `PORTFOLIO_PYTHON` environment variable. No npm install is needed.

The task does not pull, commit, push, deploy, or start a preview server. Pull before
editing when needed, then run this task after editing, review the result locally,
and commit/push the intended sources and generated files yourself. A failed task
may leave intermediate generated files: fix the error and rerun the complete task
before publishing.

Runner-only tests, which do not regenerate the website:

```sh
node scripts/test-prepare-portfolio.mjs
```

### Individual commands

Edit the corresponding HTML page for profile and contact information. The project
catalog and 16 additional case studies are generated from `case-studies.json`
and `assets/projects/media-index.json` with:

```sh
node scripts/build-case-studies.mjs
node scripts/build-translations.mjs
python scripts/prepare-site.py
node scripts/check-case-studies.mjs
node scripts/test-portfolio.mjs
node scripts/test-project-models.mjs
node scripts/test-chess-controller.mjs
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

## Interactive project models

Parking addresses use levels A-D and spaces 1-4, with the first available result
shown as A1, B3, etc. `project-models.js` owns the coordinate and motion-planning
functions, with tests for all 16 parking positions.

The mechanical chess page includes a two-dimensional three-axis positioning model,
64 occupancy indicators, electromagnet state, pause/step/reset controls, legal manual
moves and an opening/capture sequence. Its 26 mm pitch, 22 mm offset and 64 mm Z
stroke come from the linked Wokwi sketch. Motion timing and clearance are illustrative.
It does not run the Arduino firmware or the inherited Micro-Max engine.

Rules are provided by chess.js 1.4.0 (BSD-2-Clause); controls use Lucide 0.468.0 (ISC).
The pinned browser libraries and their upstream licenses are kept in `vendor/`.
The template is `templates/chess-motion.html`, behavior is `chess-demo.js`, and
styling remains in `case-study.css`. The motion tests also cover captures,
castling, en passant, promotions and return to the home position.
Controller tests cover pause/resume, one-phase stepping, reset while carrying a
piece, sensor occupancy, manual move validation, undo and low-frame-rate timing.

## Deploy on GitHub Pages

After pushing to GitHub:

1. Go to the repository settings.
2. Open **Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`.
5. Save.

GitHub will publish the portfolio automatically.
