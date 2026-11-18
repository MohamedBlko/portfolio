import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const write = (file, text) => writeFileSync(resolve(root, file), text);
const projects = JSON.parse(read('case-studies.json'));
const media = JSON.parse(read('assets/projects/media-index.json'));
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shellSource = read('project-parking.html');
const header = shellSource.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
const headLinks = shellSource.match(/<link rel="preconnect"[\s\S]*?<\/head>/)[0].replace('</head>', '');
const dialog = '<dialog class="image-lightbox" id="image-lightbox" aria-label="Enlarged project image"><header><button class="lightbox-close" type="button">Close</button></header><img alt=""><p></p></dialog>';
const shell = (title, description, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Mohamed Marou Belko</title><meta name="description" content="${esc(description)}">${headLinks}</head>
<body><canvas id="field-canvas" aria-hidden="true"></canvas><div class="atmosphere" aria-hidden="true"></div>${header}<main class="page-main case-study">${body}</main>${dialog}<footer class="site-footer"><p>&copy; <span id="year"></span> Mohamed Marou Belko.</p></footer><script src="script.js"></script><script src="case-study.js"></script></body></html>\n`;
const flow = (p) => `<div class="engineering-flow" aria-label="${p.generic ? 'Illustrative workflow, not project architecture' : 'Engineering workflow'}"><ol>${(p.flow || []).map((step, i) => `<li><small>${String(i + 1).padStart(2, '0')}</small><strong>${esc(step)}</strong></li>`).join('')}</ol>${p.generic ? '<p>Illustrative workflow. No original architecture or internal data.</p>' : ''}</div>`;
const figure = (m) => `<figure>${m.kind === 'video' ? `<video controls playsinline preload="none" poster="${esc(m.thumb)}" aria-label="${esc(m.caption)}"><source src="${esc(m.path)}" type="video/mp4"><a href="${esc(m.path)}">Open video</a></video>` : `<a href="${esc(m.path)}" data-enlarge data-caption="${esc(m.caption)}"><img src="${esc(m.thumb)}" alt="${esc(m.caption)}" width="${m.width}" height="${m.height}" loading="lazy" decoding="async"></a>`}<figcaption>${esc(m.caption)}</figcaption></figure>`;
const gallery = (items) => items.length ? `<section class="section case-content"><h2>Archive gallery <small class="media-count">${items.length} ${items.length === 1 ? 'item' : 'items'}</small></h2><div class="case-gallery" data-archive-gallery>${items.map(figure).join('\n')}</div></section>` : '';
// Two marked notebook plots contain grading marks; they are not public evidence.
for (const [slug, items] of Object.entries(media)) {
  media[slug] = items.filter((m) => !/signals-sampling-(07|09)/.test(m.path));
  if (slug === 'palan') media[slug].forEach((item, index) => { item.caption = `Saved crane-control figure Archive figure ${index + 1}.`; });
}
write('assets/projects/media-index.json', JSON.stringify(media, null, 2) + '\n');
const coverOf = (p) => {
  if (p.cover) return {path:p.cover, thumb:p.cover, caption:p.title};
  const items = media[p.slug] || [];
  const preferred = {stm32:'stm32-02', plc:'plc-08', networks:'networks-08', signals:'signals-chirp-03', harmonics:'harmonics-08', distribution:'motor-02'}[p.slug];
  return items.find((m) => preferred && m.path.includes(preferred)) || items.find((m) => m.kind === 'image');
};
const snippets = {
  yocto: {name:'layer.conf', language:'BitBake', note:'Actual archived layer configuration. This small excerpt does not include the full build environment.', code:'BBPATH .= ":${LAYERDIR}"\nBBFILES += "${LAYERDIR}/recipes-*/*/*.bb*"\nBBFILE_COLLECTIONS += "meta-ele4205"\nBBFILE_PATTERN_meta-ele4205 = "^${LAYERDIR}/"\nBBFILE_PRIORITY_meta-ele4205 = "6"\nLAYERSERIES_COMPAT_meta-ele4205 = "kirkstone"\n'},
  telecom: {name:'decodeHamming74.m', language:'MATLAB', note:'Archived helper, with comments omitted. Requires the Communications Toolbox and the original exercise framing: the first 13 bits are discarded. Not re-executed here.', code:"function msg_final = decodeHamming74(bits)\n    bits = bits(14:end);\n    L = length(bits);\n    excess = mod(L,7);\n    if excess ~= 0\n        bits = bits(1:end-excess);\n    end\n    bits7 = reshape(bits,7,[])';\n    decoded = decode(bits7, 7, 4, 'hamming');\n    msg_final = reshape(decoded.',1,[]);\nend\n"}
};
for (const [index, p] of projects.entries()) {
  const items = media[p.slug] || [];
  if (p.authored) {
    const file = `project-${p.slug}.html`;
    let html = read(file);
    const start = '<!-- ARCHIVE_MEDIA_START -->', end = '<!-- ARCHIVE_MEDIA_END -->';
    const block = new RegExp(`${start}[\\s\\S]*?${end}`);
    const previousBlock = html.match(block)?.[0];
    html = html.replace(block, '');
    const extras = items.filter((m) => !html.includes(m.path));
    const extra = `${start}\n${gallery(extras)}\n${end}\n`;
    if (previousBlock) html = read(file).replace(block, extra.trimEnd());
    else html = html.replace(/(?=<nav class="section case-content case-nav")/, extra);
    write(file, html);
    continue;
  }
  mkdirSync(resolve(root, `assets/projects/${p.slug}`), {recursive:true});
  const notes = `# ${p.title}\n\n${p.context} | ${p.status}\n\n## Objective\n${p.objective}\n\n## Engineering work\n${p.work.map((s) => '- '+s).join('\n')}\n\n## Outcome\n${p.outcome}\n\n## Limits\n${p.limits}\n\n## Evidence\n${p.sources}\n`;
  write(`assets/projects/${p.slug}/engineering-notes.md`, notes);
  const snippet = snippets[p.slug];
  if (snippet) write(`assets/projects/${p.slug}/${snippet.name}`, snippet.code);
  const cover = coverOf(p);
  const hero = cover ? `<figure class="case-hero"><a href="${esc(cover.path)}" data-enlarge><img src="${esc(cover.path)}" alt="${esc(cover.caption)}" width="${cover.width || 1200}" height="${cover.height || 800}"></a><figcaption>${esc(cover.caption)}</figcaption></figure>` : `<section class="section case-content">${flow(p)}</section>`;
  const next = projects[(index + 1) % projects.length];
  write(`project-${p.slug}.html`, shell(p.title, p.summary, `
    <header class="section case-heading"><a class="case-back" href="projects.html">Back to projects</a><p class="project-type">${esc(p.context)}</p><h1 class="page-title">${esc(p.title)}</h1><p>${esc(p.summary)}</p><dl class="case-facts"><div><dt>Status</dt><dd>${esc(p.status)}</dd></div><div><dt>Focus</dt><dd>${esc(p.category)}</dd></div><div><dt>Tools and methods</dt><dd>${esc(p.tags.join(' / '))}</dd></div></dl></header>
    ${p.slug === 'chess' ? read('templates/chess-motion.html') : ''}
    ${hero}
    <section class="section case-content case-two-column"><div><h2>Objective</h2><p>${esc(p.objective)}</p><h3>Engineering work</h3><ul>${p.work.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div><div><h2>Outcome</h2><p>${esc(p.outcome)}</p><h3>Scope and limits</h3><p>${esc(p.limits)}</p></div></section>
    ${p.flow && !p.generic ? `<section class="section case-content"><h2>Engineering workflow</h2>${flow(p)}</section>` : ''}
    ${gallery(items.filter((m) => m.path !== cover?.path))}
    ${snippet ? `<section class="section case-content"><h2>Source excerpt <small class="media-count">${esc(snippet.language)}</small></h2><p>${esc(snippet.note)}</p><pre class="case-code"><code>${esc(snippet.code)}</code></pre><div class="case-downloads"><a href="assets/projects/${p.slug}/${snippet.name}" download>Download ${esc(snippet.name)}</a></div></section>` : ''}
    <section class="section case-content"><h2>Evidence and documentation</h2><p>${esc(p.sources)}</p><div class="case-downloads"><a href="assets/projects/${p.slug}/engineering-notes.md" download>Engineering summary (.md)</a>${p.external ? `<a href="${esc(p.external.url)}" target="_blank" rel="noopener noreferrer">${esc(p.external.label)}</a>` : ''}<a href="contact.html">Contact</a></div></section>
    <nav class="section case-content case-nav" aria-label="Case study navigation"><a href="projects.html">All projects</a><a href="project-${next.slug}.html">Next: ${esc(next.title)}</a></nav>`));
}
const cards = projects.map((p) => {
  const cover = coverOf(p), items = media[p.slug] || [];
  const videos = items.filter((m) => m.kind === 'video').length;
  const images = items.length - videos;
  return `<article class="evidence-card" data-project-card data-category="${esc(p.category)}" data-search="${esc([p.title,p.summary,p.context,p.category,...p.tags].join(' ').toLowerCase())}"><a href="project-${p.slug}.html" aria-label="${esc(p.title)}">${cover ? `<img src="${esc(cover.thumb)}" alt="${esc(cover.caption)}" loading="lazy" decoding="async">` : `<div class="workflow-cover"><span>${esc(p.category)}</span><strong>${esc(p.title)}</strong><small>${esc(p.status)}</small></div>`}</a><div class="project-content"><p class="project-type">${esc(p.context)}</p><h2><a href="project-${p.slug}.html">${esc(p.title)}</a></h2><span class="case-status">${esc(p.status)}</span><p>${esc(p.summary)}</p><ul class="case-tags" aria-label="Tools and methods">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><p class="media-count">${items.length ? `${images} images${videos ? ` / ${videos} videos` : ''}` : 'Public overview / no internal media'}</p><a class="case-link" href="project-${p.slug}.html">View case study <span aria-hidden="true">&rarr;</span></a></div></article>`;
}).join('\n');
write('projects.html', shell('Engineering projects', 'Electrical engineering projects, laboratory studies and prototypes by Mohamed Marou Belko.', `<header class="section projects-intro"><h1 class="page-title">Engineering projects</h1><p>Electrical systems, automation and embedded prototypes. Original evidence, engineering decisions and clearly defined results.</p></header><section class="section project-filters" hidden aria-label="Filter projects"><label>Search<input type="search" id="project-search" placeholder="Project, tool or course" autocomplete="off"></label><label>Discipline<select id="project-category"><option value="">All disciplines</option>${[...new Set(projects.map((p) => p.category))].sort().map((c) => `<option>${esc(c)}</option>`).join('')}</select></label><p id="project-count" role="status">${projects.length} projects and studies</p></section><section class="section evidence-projects" aria-label="Project case studies">${cards}</section><p class="section" id="no-projects" hidden>No matching projects.</p>`));
for (const p of projects) if (!existsSync(resolve(root, `project-${p.slug}.html`))) throw Error(`Missing ${p.slug}`);
console.log(`Built ${projects.length} case-study pages and catalog.`);
