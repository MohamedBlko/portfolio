(() => {
  const root = document.querySelector('#chess-demo');
  if (!root) return;
  if (!window.ChessRules?.Chess || !window.PortfolioModels) {
    document.querySelector('#chess-unavailable').hidden = false;
    return;
  }
  const {Chess} = window.ChessRules;
  const model = window.PortfolioModels;
  const game = new Chess();
  const glyphs = {w:{k:'\u2654',q:'\u2655',r:'\u2656',b:'\u2657',n:'\u2658',p:'\u2659'},b:{k:'\u265a',q:'\u265b',r:'\u265c',b:'\u265d',n:'\u265e',p:'\u265f'}};
  const names = {k:'king',q:'queen',r:'rook',b:'bishop',n:'knight',p:'pawn'};
  const opening = ['e2e4','d7d5','e4d5','d8d5','b1c3','d5d8','g1f3','b8c6'];
  const $ = (id) => document.getElementById(id);
  const board = $('chess-board'), leds = $('chess-leds'), gantry = $('chess-gantry');
  const play = $('chess-play'), step = $('chess-step'), undo = $('chess-undo');
  const mode = $('chess-mode'), speed = $('chess-speed');
  const squares = [], cells = new Map(), sensors = new Map();
  const canonicalText = new WeakMap();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pieces = new Map(), captured = [], selection = null;
  let queue = [], phaseIndex = 0, elapsed = 0, position = {...model.HOME};
  let activeMove = null, lastMove = null, held = null, running = false, singlePhase = false;
  let demoIndex = 0, frame = 0, lastTime = 0, focusIndex = 0;
  let numberFormat = new Intl.NumberFormat('en-CA', {minimumFractionDigits:1,maximumFractionDigits:1});
  function nameOf(piece) { return piece ? `${piece.color === 'w' ? 'White' : 'Black'} ${names[piece.type]}` : 'Empty'; }
  function setText(id, value) {
    const element = $(id), text = String(value);
    if (canonicalText.get(element) !== text) { canonicalText.set(element, text); element.textContent = text; }
  }
  function setIcon(button, icon, label) {
    if (button.dataset.icon !== icon) {
      button.dataset.icon = icon;
      button.replaceChildren(document.createElement('i'));
      button.firstChild.setAttribute('data-lucide', icon);
      button.firstChild.setAttribute('aria-hidden', 'true');
      window.lucide?.createIcons();
    }
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  function refreshPieces() {
    pieces = new Map(game.board().flat().filter(Boolean).map((piece) => [piece.square,{type:piece.type,color:piece.color}]));
    captured = game.history({verbose:true}).filter((move) => move.captured).map((move) => ({type:move.captured,color:move.color === 'w' ? 'b' : 'w'}));
  }
  function controls() {
    setIcon(play, running ? 'pause' : 'play', running ? 'Pause' : 'Play');
    play.disabled = !running && !queue.length && (mode.value === 'manual' || demoIndex >= opening.length);
    step.disabled = running || (!queue.length && (mode.value === 'manual' || demoIndex >= opening.length));
    undo.disabled = Boolean(queue.length) || game.history().length === 0;
    const promotionMoves = selection && game.moves({square:selection,verbose:true}).some((move) => move.promotion);
    document.querySelector('.chess-promotion').hidden = !promotionMoves;
  }
  function drawBoard() {
    const destinations = selection && !queue.length ? new Set(game.moves({square:selection,verbose:true}).map((move) => move.to)) : new Set();
    for (const square of squares) {
      const button = cells.get(square), piece = pieces.get(square), glyph = button.firstChild;
      glyph.textContent = piece ? glyphs[piece.color][piece.type] : '';
      glyph.className = `chess-piece ${piece?.color === 'w' ? 'piece-white' : 'piece-black'}`;
      button.setAttribute('aria-label', `${square}: ${nameOf(piece)}`);
      button.title = `${square}: ${nameOf(piece)}`;
      button.setAttribute('aria-pressed', String(square === selection));
      button.classList.toggle('is-selected', square === selection);
      button.classList.toggle('is-target', destinations.has(square));
      button.classList.toggle('is-moving-from', activeMove?.from === square);
      button.classList.toggle('is-moving-to', activeMove?.to === square);
      button.disabled = queue.length > 0;
      const sensor = sensors.get(square);
      sensor.classList.toggle('is-occupied', Boolean(piece));
      sensor.classList.toggle('is-source', activeMove?.from === square);
      sensor.classList.toggle('is-destination', activeMove?.to === square);
    }
    setText('chess-occupancy', `${pieces.size} / 64`);
    const tray = $('chess-captured');
    tray.replaceChildren();
    for (const piece of captured) {
      const token = document.createElement('span');
      token.className = `chess-piece ${piece.color === 'w' ? 'piece-white' : 'piece-black'}`;
      token.textContent = glyphs[piece.color][piece.type];
      token.setAttribute('aria-label', nameOf(piece));
      tray.append(token);
    }
    if (!captured.length) tray.textContent = '-';
    setText('chess-from', selection || activeMove?.from || lastMove?.from || '-');
    setText('chess-to', activeMove?.to || lastMove?.to || '-');
    setText('chess-turn', game.isGameOver() ? (game.isCheckmate() ? 'Checkmate' : 'Draw') : game.turn() === 'w' ? 'White to move' : 'Black to move');
    controls();
  }
  function drawMechanism() {
    gantry.style.setProperty('--carriage-x', `${(position.x + .5) / 8 * 100}%`);
    gantry.style.setProperty('--carriage-y', `${(position.y + .5) / 8 * 100}%`);
    gantry.classList.toggle('magnet-active', Boolean(held));
    gantry.classList.toggle('z-lowered', position.z > 32);
    const dimensions = model.physicalPosition(position);
    for (const axis of ['x','y','z']) setText(`chess-${axis}`, `${numberFormat.format(Math.abs(dimensions[axis]) < .0001 ? 0 : dimensions[axis])} mm`);
    setText('chess-magnet', held ? 'On' : 'Off');
    const carried = $('chess-held-piece');
    carried.textContent = held ? glyphs[held.color][held.type] : '';
    carried.className = `chess-piece ${held?.color === 'w' ? 'piece-white' : 'piece-black'}`;
    $('chess-progress').value = queue.length ? Math.min(1, elapsed / queue[phaseIndex].duration) : 0;
  }
  function action(effect) {
    if (!effect) return;
    if (effect.type === 'pickup') { pieces.delete(effect.square); held = effect.piece; }
    else {
      if (effect.square) pieces.set(effect.square, effect.piece);
      else captured.push(effect.piece);
      held = null;
    }
    drawBoard();
  }
  function beginMove(request) {
    let move;
    try { move = game.move(request); } catch { setText('chess-phase', 'Move not available'); return false; }
    activeMove = move;
    lastMove = move;
    queue = model.motionPlan(move);
    phaseIndex = 0;
    elapsed = 0;
    position = {...model.HOME};
    selection = null;
    setText('chess-phase', queue[0].label);
    setText('chess-phase-index', `1 / ${queue.length}`);
    drawBoard();
    drawMechanism();
    return true;
  }
  function nextDemo() {
    if (demoIndex >= opening.length) { setText('chess-phase', 'Sequence complete'); return false; }
    const move = opening[demoIndex];
    if (!beginMove({from:move.slice(0,2),to:move.slice(2,4),promotion:'q'})) return false;
    demoIndex++;
    return true;
  }
  function pause() {
    running = false;
    cancelAnimationFrame(frame);
    lastTime = 0;
    controls();
  }
  function run(onePhase = false) {
    if (!queue.length && (mode.value !== 'demo' || !nextDemo())) return;
    singlePhase = onePhase;
    running = true;
    lastTime = 0;
    controls();
    frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    if (!running) return;
    const delta = lastTime ? Math.min(time - lastTime, 2000) : 0;
    lastTime = time;
    let budget = reducedMotion ? Infinity : delta * Number(speed.value);
    // Consume delayed-frame time across phase boundaries without slowing the model.
    for (let advances = 0; running && queue.length && advances < 160; advances++) {
      const phase = queue[phaseIndex];
      const consumed = Math.min(phase.duration - elapsed, budget);
      elapsed += consumed;
      budget -= consumed;
      const progress = Math.min(1, elapsed / phase.duration);
      position = Object.fromEntries(['x','y','z'].map((axis) => [axis,phase.from[axis] + (phase.target[axis]-phase.from[axis])*progress]));
      if (progress < 1) break;
      action(phase.action);
      phaseIndex++;
      elapsed = 0;
      if (phaseIndex >= queue.length) {
        queue = [];
        activeMove = null;
        position = {...model.HOME};
        drawBoard();
        setText('chess-phase', 'Move complete');
        setText('chess-phase-index', '0 / 0');
        if (!singlePhase && mode.value === 'demo') {
          if (!nextDemo()) pause();
        } else pause();
      } else {
        setText('chess-phase', queue[phaseIndex].label);
        setText('chess-phase-index', `${phaseIndex + 1} / ${queue.length}`);
        if (singlePhase) pause();
      }
      if (budget <= 0) break;
    }
    drawMechanism();
    if (running) frame = requestAnimationFrame(tick);
  }
  function reset() {
    pause();
    game.reset();
    refreshPieces();
    captured = [];
    queue = [];
    selection = null;
    activeMove = null;
    lastMove = null;
    held = null;
    position = {...model.HOME};
    phaseIndex = demoIndex = elapsed = 0;
    setText('chess-phase', 'Ready');
    setText('chess-phase-index', '0 / 0');
    drawBoard();
    drawMechanism();
  }
  function choose(square) {
    if (queue.length || game.isGameOver()) return;
    const piece = game.get(square);
    if (piece?.color === game.turn()) {
      selection = selection === square ? null : square;
      drawBoard();
      return;
    }
    if (!selection) return;
    const request = {from:selection,to:square,promotion:$('chess-promotion').value};
    if (beginMove(request)) { mode.value = 'manual'; run(); }
  }
  for (let row = 0; row < 8; row++) for (let column = 0; column < 8; column++) {
    const square = String.fromCharCode(97 + column) + (8 - row), index = squares.length;
    squares.push(square);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chess-cell ${(row + column) % 2 ? 'square-dark' : 'square-light'}`;
    button.tabIndex = index === 0 ? 0 : -1;
    button.dataset.square = square;
    const token = document.createElement('span');
    token.setAttribute('aria-hidden', 'true');
    token.setAttribute('data-no-translate', '');
    button.append(token);
    button.addEventListener('click', () => choose(square));
    button.addEventListener('focus', () => { cells.get(squares[focusIndex]).tabIndex = -1; button.tabIndex = 0; focusIndex = index; });
    button.addEventListener('keydown', (event) => {
      const offsets = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8};
      let target = offsets[event.key] !== undefined ? index + offsets[event.key] : event.key === 'Home' ? row * 8 : event.key === 'End' ? row * 8 + 7 : null;
      if (target === null) return;
      event.preventDefault();
      if (target >= 0 && target < 64) cells.get(squares[target]).focus();
    });
    cells.set(square, button);
    board.append(button);
    const sensor = document.createElement('span');
    sensor.setAttribute('aria-hidden', 'true');
    sensors.set(square,sensor);
    leds.append(sensor);
  }
  play.addEventListener('click', () => running ? pause() : run());
  step.addEventListener('click', () => run(true));
  $('chess-reset').addEventListener('click', reset);
  mode.addEventListener('change', reset);
  speed.addEventListener('input', () => setText('chess-speed-value', `${speed.value}x`));
  undo.addEventListener('click', () => {
    if (queue.length || !game.undo()) return;
    mode.value = 'manual';
    selection = null;
    activeMove = null;
    lastMove = game.history({verbose:true}).at(-1) || null;
    refreshPieces();
    setText('chess-phase', 'Ready');
    drawBoard();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  document.addEventListener('portfolio:language', () => {
    numberFormat = new Intl.NumberFormat(window.portfolioI18n?.language === 'fr' ? 'fr-CA' : 'en-CA', {minimumFractionDigits:1,maximumFractionDigits:1});
    drawBoard();
    drawMechanism();
  });
  root.hidden = false;
  window.lucide?.createIcons();
  numberFormat = new Intl.NumberFormat(window.portfolioI18n?.language === 'fr' ? 'fr-CA' : 'en-CA', {minimumFractionDigits:1,maximumFractionDigits:1});
  reset();
})();
