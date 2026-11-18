import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

function translationContext(search = '', saved = null, denyStorage = false) {
  const writes = new Map();
  const context = vm.createContext({
    window:{}, URL, URLSearchParams,
    Node:{TEXT_NODE:3, ELEMENT_NODE:1}, NodeFilter:{SHOW_TEXT:4},
    MutationObserver:class { observe() {} },
    CustomEvent:class {},
    document:{documentElement:{}, querySelectorAll:()=>[], createTreeWalker:()=>({nextNode:()=>false}), dispatchEvent() {}},
    location:{href:`https://example.test/portfolio/projects.html${search}`, search},
    history:{replaceState() {}},
    localStorage:{getItem:()=>{ if (denyStorage) throw Error('denied'); return saved; }, setItem:(key,value)=>{ if (denyStorage) throw Error('denied'); writes.set(key,value); }}
  });
  vm.runInContext(read('translations.js'), context);
  vm.runInContext(read('i18n.js'), context);
  return {context, api:context.window.portfolioI18n, writes};
}
const {context, api, writes} = translationContext();
assert.equal(api.language, 'en');
api.setLanguage('fr');
assert.equal(writes.get('portfolio-language'), 'fr');
assert.equal(context.document.documentElement.lang, 'fr');
for (const [source, translated] of Object.entries(context.window.portfolioFrench)) assert.equal(api.t(source), translated, source);
for (const [source, translated] of [
  ['6 of 19 projects and studies','6 sur 19 projets et études'],
  ['Show more (12 remaining)','Voir plus (12 restants)'],
  ['16 / 16 available','16 / 16 libres'],
  ['Level A, space 2: occupied','Niveau A, place 2 : occupée'],
  ['Next: Mechanical chess board','Suivant : Échiquier mécanique'],
  ['e2: White pawn','e2 : Pion blanc'],
  ['1 / 27 - Circuit and prototype','1 / 27 - Circuit et prototype'],
  ['Skills | Mohamed Marou Belko','Compétences | Mohamed Marou Belko']
]) assert.equal(api.t(source), translated);
api.setLanguage('en');
assert.equal(api.t('Electrical engineering'), 'Electrical engineering');
assert.equal(api.t('BBPATH .= ":${LAYERDIR}"'), 'BBPATH .= ":${LAYERDIR}"');
assert.equal(translationContext('?lang=en', 'fr').api.language, 'en');
assert.equal(translationContext('?lang=fr', null, true).api.language, 'fr');
assert.doesNotThrow(() => translationContext('?lang=fr', null, true).api.setLanguage('en'));

const contactCode = read('script.js').split('const projectDetails =')[0];
function contactContext(fetchImpl) {
  const listeners = {}, calls = [], status = {textContent:''}, submit = {disabled:false};
  const form = {action:'https://formspree.io/f/xppdpvbw', resetCalled:false, querySelector:()=>submit, querySelectorAll:()=>[], addEventListener:(name, fn)=>{listeners[name]=fn;}, reset(){this.resetCalled=true;}};
  const document = {querySelector:(selector)=>selector==='#contact-form'?form:selector==='#contact-status'?status:null, querySelectorAll:()=>[], addEventListener(){}};
  const env = vm.createContext({document, window:{}, FormData:class {constructor(){this.values=new Map([['subject','  ']]);}get(key){return this.values.get(key);}set(key,value){this.values.set(key,value);}}, fetch:async(...args)=>{calls.push(args);return fetchImpl(...args);}});
  vm.runInContext(contactCode, env);
  return {listeners, calls, status, submit, form};
}
for (const [response, expected] of [
  [{ok:true,status:200},'Thanks! Your message was sent.'],
  [{ok:false,status:429},'Too many requests. Please wait a moment and try again.'],
  [{ok:false,status:500},'Your message could not be sent. Try again or use the email address on this page.']
]) {
  const test = contactContext(async()=>response);
  await test.listeners.submit({preventDefault(){}});
  assert.equal(test.status.textContent, expected);
  assert.equal(test.submit.disabled, false);
  assert.equal(test.form.resetCalled, response.ok);
  assert.equal(test.calls[0][1].body.get('subject'), 'Portfolio inquiry');
}
const failed = contactContext(async()=>{throw Error('offline');});
await failed.listeners.submit({preventDefault(){}});
assert(failed.status.textContent.startsWith('Could not confirm'));
assert.equal(failed.form.resetCalled, false);
let complete;
const pending = contactContext(()=>new Promise((resolve)=>{complete=resolve;}));
const first = pending.listeners.submit({preventDefault(){}});
await pending.listeners.submit({preventDefault(){}});
assert.equal(pending.calls.length, 1);
complete({ok:true,status:200});
await first;
assert.equal(pending.submit.disabled, false);
console.log('PASS: bilingual copy, language persistence/fallback, dynamic labels, contact outcomes and duplicate-submit protection (no network requests).');
