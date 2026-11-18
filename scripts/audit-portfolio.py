"""Check every static page, local link, shared control and French copy coverage."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit
from lxml import html

ROOT = Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')
bundle = (ROOT/'translations.js').read_text(encoding='utf-8').split('window.portfolioFrench = ', 1)[1].strip().removesuffix(';')
translations = json.loads(bundle)
normalize = lambda s: re.sub(r'\s+', ' ', str(s)).strip()
identity = {'MB', 'FR', 'EN', 'Français', 'English', 'PE', 'P&C', 'CAD', 'PLC', 'QA', '@', 'Contact', 'LinkedIn', 'GitHub', 'Formspree', '.', 'CPI / EIT', 'FR / EN', 'Schneider Modicon M340', 'HMI / SCADA', 'MATLAB / Simulink', 'Excel / VBA', 'Python / C / C++', 'AutoCAD / EasyEDA / LTspice', 'Yocto / CMake / Linux', 'Cameo Systems Modeler / SysML / UML', 'Trolet', 'STM32 / ESP32 / Odroid-C2', 'Python, OpenCV, PySide6', '+/-24 V', 'R = 1.00', '26.00 cm'}
missing = {}
errors = []
pages = sorted(ROOT.glob('*.html'))
for path in pages:
    doc = html.document_fromstring(path.read_text(encoding='utf-8'))
    ids = doc.xpath('//@id')
    if len(ids) != len(set(ids)): errors.append(f'{path.name}: duplicate IDs')
    if len(doc.xpath('//h1')) != 1: errors.append(f'{path.name}: expected one h1')
    if len(doc.xpath('//*[@data-language]')) != 2: errors.append(f'{path.name}: missing language switch')
    scripts = doc.xpath('//script/@src')
    for src in ('translations.js', 'i18n.js', 'script.js'):
        if scripts.count(src) != 1: errors.append(f'{path.name}: script count for {src}')
    if scripts.index('i18n.js') > scripts.index('script.js'): errors.append(f'{path.name}: script order')
    for source in doc.xpath('//@href | //@src | //@poster | //@data-summary-fr | //@data-summary-en'):
        url = urlsplit(str(source))
        if url.scheme or url.netloc: continue
        target = ROOT/unquote(url.path) if url.path else path
        if not target.exists(): errors.append(f'{path.name}: broken link {source}')
        if url.fragment and target.suffix == '.html' and target.exists():
            linked = html.document_fromstring(target.read_text(encoding='utf-8'))
            if url.fragment not in linked.xpath('//@id'): errors.append(f'{path.name}: missing anchor {source}')
    copy = doc.xpath('//text()[not(ancestor::script or ancestor::style or ancestor::pre or ancestor::code)] | //@aria-label | //@alt | //@placeholder | //@title | //meta[@name="description"]/@content')
    for source in copy:
        text = normalize(source)
        if not text or text in translations or text in identity or text in {'©', '→'}: continue
        title = text.removesuffix(' | Mohamed Marou Belko')
        if title != text and title in translations: continue
        if re.fullmatch(r'[\d\s./+,:()\-]+', text): continue
        if 'Mohamed Marou Belko' == text.strip('© .'): continue
        if re.match(r'^(Next|Previous): ', text): continue
        if re.fullmatch(r'\d+ (?:images?|items?)(?: / \d+ videos?)?', text): continue
        if re.fullmatch(r'\d+ projects and studies', text): continue
        if '@' in text or re.fullmatch(r'ELE\d+ \| \d+', text): continue
        missing.setdefault(text, set()).add(path.name)
print(f'Checked {len(pages)} pages, local assets, anchors, controls and scripts.')
for error in errors: print('ERROR:', error)
for text, files in sorted(missing.items()): print('COPY:', text, '|', ', '.join(sorted(files)))
if errors or missing: raise SystemExit(1)
print('PASS: complete French text coverage; technical names and original source code preserved.')
