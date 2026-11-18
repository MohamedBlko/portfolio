import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
class Element {
  constructor() { this.children=[]; this.dataset={}; this.attributes={}; this.events={}; this.text=''; this.value=''; this.disabled=false; this.style={setProperty(){}}; this.classes=new Set(); this.classList={toggle:(name,yes)=>yes?this.classes.add(name):this.classes.delete(name)}; }
  get textContent(){return this.text;}
  set textContent(value){this.text=String(value);this.children=[];}
  get firstChild(){return this.children[0];}
  setAttribute(name,value){this.attributes[name]=String(value);if(name==='data-icon')this.dataset.icon=String(value);}
  getAttribute(name){return this.attributes[name];}
  append(child){this.children.push(child);}
  replaceChildren(...children){this.children=children;this.text='';}
  addEventListener(name,fn){this.events[name]=fn;}
  click(){if(!this.disabled)this.events.click?.({});}
}
const ids = ['chess-demo','chess-unavailable','chess-board','chess-leds','chess-gantry','chess-play','chess-step','chess-undo','chess-mode','chess-speed','chess-speed-value','chess-captured','chess-from','chess-to','chess-turn','chess-x','chess-y','chess-z','chess-magnet','chess-held-piece','chess-progress','chess-phase','chess-phase-index','chess-occupancy','chess-reset','chess-promotion'];
const elements = new Map(ids.map(id=>[id,new Element()]));
const get = id => {assert(elements.has(id),id);return elements.get(id);};
const promotionLabel = new Element(), frames = new Map(), events = {};
let frameId=0, time=1;
get('chess-mode').value='demo';get('chess-speed').value='4';get('chess-promotion').value='q';
const context = vm.createContext({window:{lucide:{createIcons(){}},portfolioI18n:{language:'en'}},Intl,
  matchMedia:()=>({matches:false}),
  requestAnimationFrame:(fn)=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:(id)=>frames.delete(id),
  document:{hidden:false,querySelector:(selector)=>selector==='.chess-promotion'?promotionLabel:get(selector.slice(1)),getElementById:get,createElement:()=>new Element(),addEventListener:(name,fn)=>{events[name]=fn;}}
});
for(const path of ['vendor/chess-1.4.0.js','project-models.js','chess-demo.js'])vm.runInContext(readFileSync(resolve(root,path),'utf8'),context);
const cells = new Map(get('chess-board').children.map(cell=>[cell.dataset.square,cell]));
function frame(delta=1000){time+=delta;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);}
function settle(limit=100){let count=0;while(frames.size&&count++<limit)frame();assert(count<limit,'Animation did not settle');}
function singleStep(){get('chess-step').click();settle();}
assert.equal(cells.size,64);
assert.equal(get('chess-occupancy').textContent,'32 / 64');
singleStep();assert.equal(get('chess-phase-index').textContent,'2 / 14');
assert.equal(get('chess-x').textContent,'156.0 mm');
singleStep();singleStep();singleStep();
assert.equal(get('chess-magnet').textContent,'On');
assert.equal(get('chess-occupancy').textContent,'31 / 64');
assert.equal(cells.get('e2').firstChild.textContent,'');
get('chess-reset').click();assert.equal(get('chess-magnet').textContent,'Off');
assert.equal(get('chess-occupancy').textContent,'32 / 64');
get('chess-play').click();frame();frame(100);
get('chess-play').click();const paused=get('chess-x').textContent;
frame(1000);assert.equal(get('chess-x').textContent,paused);
get('chess-play').click();settle();
assert.equal(get('chess-phase').textContent,'Sequence complete');
assert.equal(get('chess-occupancy').textContent,'30 / 64');
assert.equal(get('chess-captured').children.length,2);
for(const axis of ['x','y','z'])assert.equal(get(`chess-${axis}`).textContent,'0.0 mm');
assert.equal(cells.get('c6').getAttribute('aria-label'),'c6: Black knight');
get('chess-undo').click();assert.equal(cells.get('b8').getAttribute('aria-label'),'b8: Black knight');
get('chess-reset').click();
cells.get('e2').click();cells.get('e5').click();assert.equal(get('chess-phase').textContent,'Move not available');
assert.equal(get('chess-occupancy').textContent,'32 / 64');
cells.get('e4').click();settle();
assert.equal(get('chess-mode').value,'manual');
assert.equal(cells.get('e4').getAttribute('aria-label'),'e4: White pawn');
assert.equal(get('chess-from').textContent,'e2');assert.equal(get('chess-to').textContent,'e4');
get('chess-undo').click();assert.equal(cells.get('e2').getAttribute('aria-label'),'e2: White pawn');
context.window.portfolioI18n.language='fr';events['portfolio:language']();assert.equal(get('chess-x').textContent,'0,0 mm');
console.log('PASS: controller step/pause/resume/reset, pickup occupancy, full captures, low-frame-rate timing, manual validation, undo and locale formatting.');
