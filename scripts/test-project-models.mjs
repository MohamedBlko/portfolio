import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const model = createRequire(import.meta.url)('../project-models.js');
assert.deepEqual(Array.from({length:16},(_,i)=>model.parkingAddress(i)), ['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4']);
assert.equal(model.firstAvailable(Array(16).fill(false)), 'A1');
assert.equal(model.firstAvailable(Array(16).fill(true)), null);
for (const [index,address] of [[1,'A2'],[6,'B3'],[15,'D4']]) {
  const occupied = Array(16).fill(true); occupied[index] = false;
  assert.equal(model.firstAvailable(occupied), address);
}
assert.throws(()=>model.parkingAddress(16), RangeError);
assert.throws(()=>model.firstAvailable([false]), TypeError);
assert.throws(()=>model.squarePoint('a0'), RangeError);
assert.throws(()=>model.squarePoint('i1'), RangeError);
const physical = model.physicalPosition(model.squarePoint('h1'));
assert.deepEqual(physical, {x:182,y:204,z:0});

const context = vm.createContext({window:{}});
vm.runInContext(readFileSync(resolve(root,'vendor/chess-1.4.0.js'),'utf8'),context);
const {Chess} = context.window.ChessRules;
const snapshot = (game) => new Map(game.board().flat().filter(Boolean).map(p=>[p.square,{type:p.type,color:p.color}]));
function verifyMove(game, request) {
  const board = snapshot(game), move = game.move(request), phases = model.motionPlan(move);
  let held = null, position = model.HOME;
  for (const phase of phases) {
    assert.deepEqual(phase.from, position);
    assert(phase.duration > 0);
    assert(phase.target.z === 0 || phase.target.z === 64);
    position = phase.target;
    const effect = phase.action;
    if (!effect) continue;
    if (effect.type === 'pickup') {
      assert.equal(held, null);
      assert.deepEqual(board.get(effect.square), effect.piece);
      board.delete(effect.square);
      held = effect.piece;
    } else {
      assert(held);
      if (effect.square) {
        assert(!board.has(effect.square));
        board.set(effect.square,effect.piece);
      }
      held = null;
    }
  }
  assert.equal(held,null);
  assert.deepEqual(position,model.HOME);
  const sorted = (map) => [...map].sort(([a],[b])=>a.localeCompare(b));
  assert.deepEqual(sorted(board),sorted(snapshot(game)));
  return phases;
}
const game = new Chess();
for (const move of ['e2e4','d7d5','e4d5','d8d5','b1c3','d5d8','g1f3','b8c6']) verifyMove(game,{from:move.slice(0,2),to:move.slice(2),promotion:'q'});
assert.equal(verifyMove(new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'),{from:'e1',to:'g1'}).length,28);
assert.equal(verifyMove(new Chess('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1'),{from:'e8',to:'c8'}).length,28);
verifyMove(new Chess('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1'),{from:'e5',to:'d6'});
for (const promotion of ['q','r','b','n']) verifyMove(new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1'),{from:'a7',to:'a8',promotion});
console.log('PASS: A1-D4 parking coordinates; motion plans, captures, castling, en passant, promotions, sensor states and home return.');
