(function (root) {
  const PITCH = 26;
  const Y_OFFSET = 22;
  const HOME = Object.freeze({x: -Y_OFFSET / PITCH, y: 0, z: 0});
  function parkingAddress(index) {
    if (!Number.isInteger(index) || index < 0 || index > 15) throw new RangeError('Invalid parking index');
    return 'ABCD'[Math.floor(index / 4)] + (index % 4 + 1);
  }
  function firstAvailable(occupied) {
    if (occupied.length !== 16 || occupied.some((value) => typeof value !== 'boolean')) throw new TypeError('Expected 16 occupancy states');
    const index = occupied.indexOf(false);
    return index < 0 ? null : parkingAddress(index);
  }
  function squarePoint(square) {
    if (!/^[a-h][1-8]$/.test(square)) throw new RangeError('Invalid chess coordinate');
    return {x: square.charCodeAt(0) - 97, y: 8 - Number(square[1]), z: 0};
  }
  function physicalPosition(point) {
    return {x: point.y * PITCH, y: point.x * PITCH + Y_OFFSET, z: point.z};
  }
  function transfer(fromSquare, toSquare, piece, droppedPiece = piece) {
    let cursor = {...HOME};
    const source = squarePoint(fromSquare);
    const target = toSquare ? squarePoint(toSquare) : HOME;
    const phases = [];
    function phase(label, changes, action) {
      const next = {...cursor, ...changes};
      const distance = Math.max(Math.abs(next.x - cursor.x), Math.abs(next.y - cursor.y));
      const duration = changes.z !== undefined ? 360 : Object.keys(changes).length ? Math.max(100, distance * 145) : 160;
      phases.push({label, from:cursor, target:next, duration, action});
      cursor = next;
    }
    // The sketch returns home between pickup and delivery; timing remains illustrative.
    phase('Move X to pickup', {y:source.y});
    phase('Move Y to pickup', {x:source.x});
    phase('Lower Z', {z:64});
    phase('Magnet on', {}, {type:'pickup', square:fromSquare, piece});
    phase('Raise Z', {z:0});
    phase('Return X home', {y:HOME.y});
    phase('Return Y home', {x:HOME.x});
    phase('Move X to destination', {y:target.y});
    phase('Move Y to destination', {x:target.x});
    phase('Lower Z', {z:64});
    phase('Magnet off', {}, {type:'drop', square:toSquare, piece:droppedPiece});
    phase('Raise Z', {z:0});
    phase('Return X home', {y:HOME.y});
    phase('Return Y home', {x:HOME.x});
    return phases;
  }
  function motionPlan(move) {
    squarePoint(move.from);
    squarePoint(move.to);
    const phases = [];
    if (move.captured) {
      const square = move.flags.includes('e') ? move.to[0] + move.from[1] : move.to;
      phases.push(...transfer(square, null, {type:move.captured, color:move.color === 'w' ? 'b' : 'w'}));
    }
    const piece = {type:move.piece, color:move.color};
    const placed = {type:move.promotion || move.piece, color:move.color};
    phases.push(...transfer(move.from, move.to, piece, placed));
    if (move.flags.includes('k') || move.flags.includes('q')) {
      const rank = move.color === 'w' ? '1' : '8';
      const kingSide = move.flags.includes('k');
      phases.push(...transfer((kingSide ? 'h' : 'a') + rank, (kingSide ? 'f' : 'd') + rank, {type:'r', color:move.color}));
    }
    return phases;
  }
  const api = {parkingAddress, firstAvailable, squarePoint, physicalPosition, motionPlan, HOME, PITCH, Y_OFFSET};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PortfolioModels = api;
})(typeof window !== 'undefined' ? window : globalThis);
