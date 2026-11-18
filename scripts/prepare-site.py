"""Normalize shared navigation and package bilingual copy; requires lxml."""
import json
import hashlib
from pathlib import Path
from urllib.parse import urlsplit
from lxml import html, etree

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = {p['slug']: p for p in json.loads((ROOT/'case-studies.json').read_text(encoding='utf-8'))}
FOOTER = '''<footer class="site-footer"><nav aria-label="Contact and resume"><a href="tel:+14388780897">(438) 878-0897</a><a href="mailto:mohamed_belko@outlook.com">mohamed_belko@outlook.com</a><a href="https://www.linkedin.com/in/mohamed-belko-857b651a1">LinkedIn</a><a href="assets/CV_Mohamed_Marou_Belko_Generic.pdf">Resume (PDF, EN)</a></nav><p>&copy; <span id="year"></span> Mohamed Marou Belko.</p></footer>'''
SWITCH = '''<div class="language-switch" role="group" aria-label="Language" hidden><button type="button" data-language="fr" lang="fr" aria-label="Français" aria-pressed="false">FR</button><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="true">EN</button></div>'''

for path in ROOT.glob('*.html'):
    doc = html.document_fromstring(path.read_text(encoding='utf-8'))
    for resource in doc.xpath('//script[@src] | //link[@rel="stylesheet"]'):
        attribute = 'src' if resource.tag == 'script' else 'href'
        url = urlsplit(resource.get(attribute))
        if not url.scheme and not url.netloc:
            resource.set(attribute, url.path)
    header = doc.find('.//header[@class="site-header"]')
    if header is None:
        continue
    controls = header.find('./div[@class="header-controls"]')
    if controls is None:
        controls = etree.SubElement(header, 'div', {'class':'header-controls'})
        controls.append(html.fragment_fromstring(SWITCH))
        toggle = header.find('.//button[@class="nav-toggle"]')
        if toggle is not None:
            controls.append(toggle)
    page = path.name
    slug = path.stem.removeprefix('project-')
    if slug in PROJECTS:
        for context in doc.xpath('//header[contains(@class,"case-heading")]/p[@class="project-type"]'):
            context.text = PROJECTS[slug]['context']
    if page == 'projects.html':
        doc.get_element_by_id('project-search').set('placeholder', 'Project or tool')
    for link in header.findall('.//nav/a'):
        target = link.get('href', '').split('?')[0]
        link.attrib.pop('aria-current', None)
        if target == page or (page.startswith('project-') and target == 'projects.html'):
            link.set('aria-current', 'page')
    footer = doc.find('.//footer[@class="site-footer"]')
    if footer is not None:
        footer.getparent().replace(footer, html.fragment_fromstring(FOOTER))
    for script in list(doc.findall('.//script')):
        if script.get('src') in ('translations.js', 'i18n.js'):
            script.getparent().remove(script)
    script = doc.find('.//script[@src="script.js"]')
    for src in ['translations.js', 'i18n.js']:
        script.addprevious(etree.Element('script', src=src))
    extra_scripts = ['project-models.js'] if slug in ('parking', 'chess') else []
    if slug == 'chess':
        extra_scripts += ['vendor/chess-1.4.0.js', 'vendor/lucide-0.468.0.min.js', 'chess-demo.js']
    anchor = doc.find('.//script[@src="case-study.js"]')
    for src in extra_scripts:
        for previous in doc.xpath('//script[@src=$src]', src=src):
            previous.getparent().remove(previous)
        anchor.addprevious(etree.Element('script', src=src))
    for link in doc.findall('.//a'):
        href = link.get('href', '')
        if href == 'assets/CV_Mohamed_Marou_Belko_Generic.pdf':
            link.text = 'Resume (PDF, EN)'
        if href.endswith('/engineering-notes.md'):
            french = href.replace('.md', '.fr.md')
            if (ROOT / french).exists():
                link.set('data-summary-en', href)
                link.set('data-summary-fr', french)
    for option in doc.findall('.//option'):
        if option.get('value') is None:
            option.set('value', option.text or '')
    for icon in doc.xpath('//*[contains(concat(" ", normalize-space(@class), " "), " node-icon ")]'):
        icon.set('data-no-translate', '')
    if page == 'index.html':
        # A meaningful title without changing the existing 3D scene.
        doc.find('.//h1').set('class', 'home-title')
    for resource in doc.xpath('//script[@src] | //link[@rel="stylesheet"]'):
        attribute = 'src' if resource.tag == 'script' else 'href'
        url = urlsplit(resource.get(attribute))
        target = ROOT / url.path
        if not url.scheme and not url.netloc and target.is_file():
            version = hashlib.sha256(target.read_bytes()).hexdigest()[:10]
            resource.set(attribute, url.path+'?v='+version)
    serialized = html.tostring(doc, encoding='unicode', doctype='<!doctype html>', method='html')
    serialized = '\n'.join('' if not line.strip() else line for line in serialized.splitlines())
    path.write_text(serialized+'\n', encoding='utf-8')
print('Prepared shared navigation and language controls on all HTML pages.')
