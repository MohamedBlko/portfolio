import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const projects = JSON.parse(read('case-studies.json'));
const media = JSON.parse(read('assets/projects/media-index.json'));
assert.equal(projects.length, 19);
assert.equal(new Set(projects.map((p) => p.slug)).size, projects.length);
let imageCount = 0, videoCount = 0;
for (const p of projects) {
  const html = read(`project-${p.slug}.html`);
  assert(html.includes(`<h1 class="page-title">${p.title}</h1>`), `Missing title: ${p.slug}`);
  assert(html.includes('case-study.js') && html.includes('case-study.css'));
  assert(html.includes('id="site-nav"') && html.includes('id="image-lightbox"'));
  assert(!/D:[\\/]|matricule|ALSSCI/i.test(html), `Private marker: ${p.slug}`);
  if (p.generic) {
    assert(!media[p.slug]?.length, `Confidential media: ${p.slug}`);
    assert(html.includes('Illustrative workflow'));
  }
  for (const m of media[p.slug] || []) {
    assert(m.path.startsWith(`assets/projects/${p.slug}/`), `Cross-project asset: ${m.path}`);
    for (const path of [m.path, m.thumb]) {
      assert(existsSync(resolve(root, path)), `Missing media: ${path}`);
      assert(statSync(resolve(root, path)).size > 100, `Empty media: ${path}`);
    }
    assert(!/D:[\\/]|OneDrive|matricule|sampling-0[79]/i.test(JSON.stringify(m)));
    assert(html.includes(m.path), `Unlinked evidence: ${m.path}`);
    if (m.kind === 'video') videoCount++; else imageCount++;
  }
}
for (const file of ['projects.html', ...projects.map((p) => `project-${p.slug}.html`)]) {
  const html = read(file);
  for (const match of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
    const path = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(path)) continue;
    assert(existsSync(resolve(root, path.split('#')[0])), `${file}: missing link ${path}`);
  }
  for (const match of html.matchAll(/<video\b[^>]*>/g)) assert(match[0].includes('preload="none"') && !match[0].includes('autoplay'));
}
const catalog = read('projects.html');
assert.equal((catalog.match(/data-project-card /g) || []).length, projects.length);
assert(!catalog.includes('data-project='), 'Old placeholder modal cards remain');
assert(read('case-study.js').includes('ArrowLeft'));
console.log(`PASS: ${projects.length} pages, ${imageCount} images, ${videoCount} videos; links, privacy markers and catalog checked.`);
