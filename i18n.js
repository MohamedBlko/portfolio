(() => {
  const dictionary = window.portfolioFrench || {};
  const normalize = (text) => String(text).replace(/\s+/g, ' ').trim();
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  let saved;
  try { saved = localStorage.getItem('portfolio-language'); } catch { /* File previews may deny storage. */ }
  let language = ['fr', 'en'].includes(queryLanguage) ? queryLanguage : ['fr', 'en'].includes(saved) ? saved : 'en';
  const texts = new WeakMap();
  const attributes = new WeakMap();
  const attrNames = ['aria-label', 'alt', 'title', 'placeholder'];

  function translate(source, lang = language) {
    if (lang !== 'fr' || !source) return source;
    const text = normalize(source);
    if (Object.hasOwn(dictionary, text)) return dictionary[text];
    let match;
    if ((match = /^(Next|Previous): (.+)$/.exec(text))) return `${match[1] === 'Next' ? 'Suivant' : 'Précédent'} : ${translate(match[2], lang)}`;
    if ((match = /^(\d+) of (\d+) projects and studies$/.exec(text))) return `${match[1]} sur ${match[2]} projets et études`;
    if ((match = /^(\d+) projects and studies$/.exec(text))) return `${match[1]} projets et études`;
    if ((match = /^(\d+) (images?|items?)(?: \/ (\d+) videos?)?$/.exec(text))) return `${match[1]} ${match[2].startsWith('image') ? (match[1] === '1' ? 'image' : 'images') : (match[1] === '1' ? 'élément' : 'éléments')}${match[3] ? ` / ${match[3]} vidéos` : ''}`;
    if ((match = /^Show more \((\d+) remaining\)$/.exec(text))) return `Voir plus (${match[1]} restants)`;
    if ((match = /^(\d+) \/ 16 available$/.exec(text))) return `${match[1]} / 16 libres`;
    if ((match = /^Level (\d+), space (\d+): (occupied|available)$/.exec(text))) return `Étage ${match[1]}, place ${match[2]} : ${match[3] === 'occupied' ? 'occupée' : 'libre'}`;
    if ((match = /^Toggle level (\d+), space (\d+)$/.exec(text))) return `Changer l'état : étage ${match[1]}, place ${match[2]}`;
    if ((match = /^(\d+) \/ (\d+) - (.+)$/.exec(text))) return `${match[1]} / ${match[2]} - ${translate(match[3], lang)}`;
    if (text.endsWith(' | Mohamed Marou Belko')) return translate(text.slice(0, -' | Mohamed Marou Belko'.length), lang) + ' | Mohamed Marou Belko';
    return source;
  }

  function applyText(node) {
    if (!node.parentElement || node.parentElement.closest('script, style, pre, code, [data-no-translate]')) return;
    const current = node.data;
    let entry = texts.get(node);
    if (!entry || (current !== entry.last && current !== entry.en)) entry = {en:current};
    const translated = translate(entry.en);
    entry.last = translated === entry.en ? entry.en : entry.en.replace(/^(\s*)[\s\S]*?(\s*)$/, (_, before, after) => before + translated + after);
    texts.set(node, entry);
    if (node.data !== entry.last) node.data = entry.last;
  }

  function applyAttribute(element, name) {
    if (!element.hasAttribute(name)) return;
    let entries = attributes.get(element);
    if (!entries) { entries = {}; attributes.set(element, entries); }
    const value = element.getAttribute(name);
    let entry = entries[name];
    if (!entry || (value !== entry.last && value !== entry.en)) entry = {en:value};
    entry.last = translate(entry.en);
    entries[name] = entry;
    if (value !== entry.last) element.setAttribute(name, entry.last);
  }

  function localize(root = document) {
    if (root.nodeType === Node.TEXT_NODE) { applyText(root); return; }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) applyText(walker.currentNode);
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')];
    for (const element of elements) {
      if (element.closest('[data-no-translate]')) continue;
      for (const name of attrNames) applyAttribute(element, name);
      if (element.matches('meta[name="description"]')) applyAttribute(element, 'content');
    }
  }

  function updateLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const url = new URL(link.getAttribute('href'), location.href);
      if (!url.pathname.endsWith('.html') || url.origin !== location.origin || url.protocol !== location.protocol) return;
      url.searchParams.set('lang', language);
      link.setAttribute('href', url.href);
    });
    document.querySelectorAll('[data-summary-fr]').forEach((link) => {
      const target = language === 'fr' ? link.dataset.summaryFr : link.dataset.summaryEn;
      if (target) link.setAttribute('href', target);
    });
  }

  function setLanguage(next, remember = true) {
    if (!['fr', 'en'].includes(next)) return;
    language = next;
    document.documentElement.lang = next;
    if (remember) {
      try { localStorage.setItem('portfolio-language', next); } catch { /* Query links retain language without storage. */ }
      try { const url = new URL(location.href); url.searchParams.set('lang', next); history.replaceState(null, '', url); } catch { /* Some local-file contexts restrict history. */ }
    }
    localize();
    document.querySelectorAll('[data-language]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === next)));
    updateLinks();
    document.dispatchEvent(new CustomEvent('portfolio:language', {detail:{language:next}}));
  }

  window.portfolioI18n = {
    t: translate,
    get language() { return language; },
    setLanguage,
    originalAttribute: (element, name) => attributes.get(element)?.[name]?.en ?? element.getAttribute(name),
    searchText: (element) => {
      const words = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const source = texts.get(walker.currentNode)?.en ?? walker.currentNode.data;
        words.push(source, translate(source, 'fr'));
      }
      return words.join(' ');
    },
    normalize
  };
  document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  document.querySelectorAll('.language-switch').forEach((control) => { control.hidden = false; });
  setLanguage(language, false);
  new MutationObserver((changes) => {
    for (const change of changes) {
      if (change.type === 'characterData') applyText(change.target);
      else if (change.type === 'attributes') applyAttribute(change.target, change.attributeName);
      else change.addedNodes.forEach((node) => { if ([Node.TEXT_NODE, Node.ELEMENT_NODE].includes(node.nodeType)) localize(node); });
    }
  }).observe(document.documentElement, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:[...attrNames, 'content']});
})();
