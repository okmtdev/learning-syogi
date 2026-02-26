// Board rendering utilities
import { PIECE_CHARS, isPromoted } from './pieces.js';
import { tStandard } from './i18n.js';

/**
 * Create a 9x9 board element
 * @param {Object} options
 * @param {Array} options.pieces - Array of { type, row, col, owner } (owner: 1=player, -1=enemy)
 * @param {Array} options.highlighted - Array of [row, col] to highlight
 * @param {Array} options.selected - [row, col] of selected cell
 * @param {Function} options.onCellClick - callback(row, col)
 * @param {boolean} options.small - use smaller board
 * @param {Array} options.lastMove - [row, col] of last moved piece
 * @returns {HTMLElement}
 */
export function createBoard(options = {}) {
  const {
    pieces = [],
    highlighted = [],
    selected = null,
    onCellClick = null,
    small = false,
    lastMove = null,
    correctCells = [],
    wrongCells = [],
    missedCells = [],
  } = options;

  const boardEl = document.createElement('div');
  boardEl.className = 'board' + (small ? ' board-small' : '');

  // Build a lookup for pieces
  const pieceMap = {};
  for (const p of pieces) {
    pieceMap[`${p.row},${p.col}`] = p;
  }

  const highlightSet = new Set(highlighted.map(([r,c]) => `${r},${c}`));
  const correctSet = new Set(correctCells.map(([r,c]) => `${r},${c}`));
  const wrongSet = new Set(wrongCells.map(([r,c]) => `${r},${c}`));
  const missedSet = new Set(missedCells.map(([r,c]) => `${r},${c}`));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const key = `${row},${col}`;

      if (highlightSet.has(key)) cell.classList.add('highlighted');
      if (selected && selected[0] === row && selected[1] === col) cell.classList.add('selected');
      if (lastMove && lastMove[0] === row && lastMove[1] === col) cell.classList.add('last-move');
      if (correctSet.has(key)) cell.classList.add('correct-mark');
      if (wrongSet.has(key)) cell.classList.add('wrong-mark');
      if (missedSet.has(key)) cell.classList.add('missed-mark');

      const piece = pieceMap[key];
      if (piece) {
        const charKey = PIECE_CHARS[piece.type];
        const span = document.createElement('span');
        span.className = 'piece-char';
        if (piece.owner === -1) span.classList.add('enemy');
        if (isPromoted(piece.type)) span.classList.add('promoted');
        span.textContent = tStandard(charKey);
        cell.appendChild(span);
      }

      if (onCellClick) {
        cell.addEventListener('click', () => onCellClick(row, col));
      }

      boardEl.appendChild(cell);
    }
  }

  return boardEl;
}

/**
 * Build a 9x9 array from piece list
 */
export function buildBoardArray(pieces) {
  const board = Array.from({ length: 9 }, () => Array(9).fill(null));
  for (const p of pieces) {
    board[p.row][p.col] = { type: p.type, owner: p.owner };
  }
  return board;
}
