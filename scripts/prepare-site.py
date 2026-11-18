"""Normalize shared navigation and package bilingual copy; requires lxml."""
import json
from pathlib import Path
from lxml import html, etree

ROOT = Path(__file__).resolve().parent.parent
FOOTER = '''<footer class="site-footer"><nav aria-label="Contact and resume"><a href="tel:+14388780897">(438) 878-0897</a><a href="mailto:mohamed_belko@outlook.com">mohamed_belko@outlook.com</a><a href="https://www.linkedin.com/in/mohamed-belko-857b651a1">LinkedIn</a><a href="assets/CV_Mohamed_Marou_Belko_Generic.pdf">Resume (PDF, EN)</a></nav><p>&copy; <span id="year"></span> Mohamed Marou Belko.</p></footer>'''
SWITCH = '''<div class="language-switch" role="group" aria-label="Language" hidden><button type="button" data-language="fr" lang="fr" aria-label="Français" aria-pressed="false">FR</button><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="true">EN</button></div>'''

for path in ROOT.glob('*.html'):
    doc = html.document_fromstring(path.read_text(encoding='utf-8'))
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
    path.write_text(html.tostring(doc, encoding='unicode', doctype='<!doctype html>', method='html')+'\n', encoding='utf-8')
print('Prepared shared navigation and language controls on all HTML pages.')
