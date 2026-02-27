import { t, isKidsMode } from '../i18n.js';
import { createBoard, buildBoardArray } from '../board.js';
import { getValidMoves, PIECE_CHARS } from '../pieces.js';
import { PUZZLES } from '../puzzles.js';
import { markPuzzleCleared } from '../storage.js';
import { playKoma, playHakusyu, playHatodokei } from '../audio.js';

export function renderTsumePlay(app, navigate, params) {
  const puzzle = PUZZLES[params.puzzleIndex];
  let pieces = JSON.parse(JSON.stringify(puzzle.pieces));
  let hand = JSON.parse(JSON.stringify(puzzle.hand));
  let moveCount = 0;
  let isPlayerTurn = true;
  let selectedPiece = null; // { row, col } for board piece or { handIndex, type } for hand piece
  let validMoves = [];
  let lastMove = null;
  let gameOver = false;
  let gameResult = null; // 'clear' | 'fail'

  let initialized = false;

  function render() {
    app.innerHTML = '';

    if (!initialized) {
      initialized = true;
      playHatodokei();
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-back';
    backBtn.textContent = t('back');
    backBtn.addEventListener('click', () => navigate('tsumeMenu'));
    app.appendChild(backBtn);

    const title = document.createElement('h2');
    title.textContent = `${puzzle.name} - ${isKidsMode() ? puzzle.descriptionKids : puzzle.description}`;
    app.appendChild(title);

    // Hint
    const hint = document.createElement('div');
    hint.className = 'explanation-box';
    hint.textContent = isKidsMode() ? puzzle.hintTextKids : puzzle.hintText;
    app.appendChild(hint);

    // Move count display
    const moveInfo = document.createElement('div');
    moveInfo.className = 'move-count';
    moveInfo.textContent = `${t('moveCount')}: ${moveCount} / ${puzzle.maxMoves}`;
    app.appendChild(moveInfo);

    // Status
    const status = document.createElement('p');
    status.style.textAlign = 'center';
    status.style.fontWeight = 'bold';
    if (!gameOver) {
      status.textContent = isPlayerTurn ? t('yourTurn') : t('enemyTurn');
    }
    app.appendChild(status);

    // Board
    const boardArray = buildBoardArray(pieces);
    const container = document.createElement('div');
    container.className = 'board-container';
    const board = createBoard({
      pieces,
      highlighted: validMoves,
      selected: selectedPiece && selectedPiece.row !== undefined ? [selectedPiece.row, selectedPiece.col] : null,
      lastMove,
      onCellClick: (r, c) => {
        if (gameOver || !isPlayerTurn) return;
        handleCellClick(r, c, boardArray);
      },
    });
    container.appendChild(board);
    app.appendChild(container);

    // Hand pieces
    if (hand.length > 0) {
      const handDiv = document.createElement('div');
      handDiv.style.display = 'flex';
      handDiv.style.alignItems = 'center';
      handDiv.style.gap = '8px';
      handDiv.style.marginTop = '8px';

      const handLabel = document.createElement('span');
      handLabel.style.fontWeight = 'bold';
      handLabel.textContent = t('hand') + '：';
      handDiv.appendChild(handLabel);

      hand.forEach((h, i) => {
        if (h.count <= 0) return;
        const btn = document.createElement('button');
        btn.className = 'btn btn-small btn-outline';
        const isSelected = selectedPiece && selectedPiece.handIndex === i;
        if (isSelected) {
          btn.style.background = 'var(--color-selected)';
        }
        btn.textContent = `${t(PIECE_CHARS[h.type])} x${h.count}`;
        btn.addEventListener('click', () => {
          if (gameOver || !isPlayerTurn) return;
          if (isSelected) {
            selectedPiece = null;
            validMoves = [];
          } else {
            selectedPiece = { handIndex: i, type: h.type };
            // Valid drop squares: any empty square
            validMoves = [];
            for (let r = 0; r < 9; r++) {
              for (let c = 0; c < 9; c++) {
                if (!boardArray[r][c]) {
                  // Pawn drop restrictions: can't drop on last rank, no double pawn
                  if (h.type === 'pawn') {
                    if (r === 0) continue;
                    const hasPawnInCol = pieces.some(p => p.type === 'pawn' && p.owner === 1 && p.col === c);
                    if (hasPawnInCol) continue;
                  }
                  if (h.type === 'lance' && r === 0) continue;
                  if (h.type === 'knight' && r <= 1) continue;
                  validMoves.push([r, c]);
                }
              }
            }
          }
          render();
        });
        handDiv.appendChild(btn);
      });

      if (hand.some(h => h.count > 0)) {
        const dropHint = document.createElement('p');
        dropHint.style.textAlign = 'center';
        dropHint.style.fontSize = '0.85rem';
        dropHint.style.color = '#888';
        dropHint.textContent = t('selectPiece');
        app.appendChild(handDiv);
        app.appendChild(dropHint);
      }
    }

    // Game over overlay
    if (gameOver) {
      renderGameOverOverlay();
    }
  }

  function handleCellClick(r, c, boardArray) {
    // If we have a selected piece and clicked on a valid move square
    if (selectedPiece && validMoves.some(([mr, mc]) => mr === r && mc === c)) {
      // Execute move
      if (selectedPiece.handIndex !== undefined) {
        // Drop from hand
        pieces.push({ type: selectedPiece.type, row: r, col: c, owner: 1 });
        hand[selectedPiece.handIndex].count--;
      } else {
        // Move board piece
        const piece = pieces.find(p => p.row === selectedPiece.row && p.col === selectedPiece.col && p.owner === 1);
        // Capture enemy piece if present
        const captured = pieces.findIndex(p => p.row === r && p.col === c && p.owner === -1);
        if (captured >= 0) {
          pieces.splice(captured, 1);
        }
        piece.row = r;
        piece.col = c;
      }

      lastMove = [r, c];
      moveCount++;
      selectedPiece = null;
      validMoves = [];
      playKoma();

      // Check if this is checkmate
      if (isCheckmate(pieces)) {
        gameOver = true;
        gameResult = 'clear';
        markPuzzleCleared(puzzle.id);
        playHakusyu();
        render();
        return;
      }

      // Check if we've used all moves without checkmate
      if (moveCount >= puzzle.maxMoves) {
        // Player used all moves but didn't checkmate
        // For 3-move puzzle, player gets 2 moves (move 1 and move 3)
        // Actually maxMoves counts total including enemy
        gameOver = true;
        gameResult = 'fail';
        render();
        return;
      }

      // Check if the move gives check
      if (!isInCheck(pieces, -1)) {
        // Not a check - invalid move in tsume shogi (every move must be check)
        // Revert
        gameOver = true;
        gameResult = 'fail';
        render();
        return;
      }

      // Enemy turn
      isPlayerTurn = false;
      render();
      setTimeout(() => {
        doEnemyMove();
      }, 600);
      return;
    }

    // Select a board piece
    const piece = pieces.find(p => p.row === r && p.col === c && p.owner === 1);
    if (piece) {
      selectedPiece = { row: r, col: c };
      const ba = buildBoardArray(pieces);
      validMoves = getValidMoves(piece.type, r, c, 1, ba);
      render();
      return;
    }

    // Deselect
    selectedPiece = null;
    validMoves = [];
    render();
  }

  function doEnemyMove() {
    // Find king and try all escape moves
    const king = pieces.find(p => p.type === 'king' && p.owner === -1);
    if (!king) {
      gameOver = true;
      gameResult = 'clear';
      markPuzzleCleared(puzzle.id);
      render();
      return;
    }

    const ba = buildBoardArray(pieces);
    const kingMoves = getValidMoves('king', king.row, king.col, -1, ba);

    // Filter: king can only move to squares not attacked by player
    const safeMoves = kingMoves.filter(([r, c]) => {
      // Simulate move
      const tempPieces = JSON.parse(JSON.stringify(pieces));
      const tempKing = tempPieces.find(p => p.type === 'king' && p.owner === -1);

      // Remove captured piece if any
      const capIdx = tempPieces.findIndex(p => p.row === r && p.col === c && p.owner === 1);
      if (capIdx >= 0) tempPieces.splice(capIdx, 1);

      tempKing.row = r;
      tempKing.col = c;

      return !isInCheck(tempPieces, -1);
    });

    // Also try blocking/capturing with other pieces
    const enemyPieces = pieces.filter(p => p.owner === -1 && p.type !== 'king');
    const blockMoves = [];
    for (const ep of enemyPieces) {
      const moves = getValidMoves(ep.type, ep.row, ep.col, -1, ba);
      for (const [r, c] of moves) {
        const tempPieces = JSON.parse(JSON.stringify(pieces));
        const tempEp = tempPieces.find(p => p.row === ep.row && p.col === ep.col && p.owner === -1 && p.type === ep.type);

        const capIdx = tempPieces.findIndex(p => p.row === r && p.col === c && p.owner === 1);
        if (capIdx >= 0) tempPieces.splice(capIdx, 1);

        tempEp.row = r;
        tempEp.col = c;

        if (!isInCheck(tempPieces, -1)) {
          blockMoves.push({ piece: ep, to: [r, c] });
        }
      }
    }

    const allMoves = [
      ...safeMoves.map(([r, c]) => ({ type: 'king', to: [r, c] })),
      ...blockMoves.map(bm => ({ type: 'block', piece: bm.piece, to: bm.to })),
    ];

    if (allMoves.length === 0) {
      // Checkmate! Player wins
      gameOver = true;
      gameResult = 'clear';
      markPuzzleCleared(puzzle.id);
      playHakusyu();
      render();
      return;
    }

    // Score each move to pick the best defensive response
    // Prioritize: captures > blocks > escape toward center
    for (const m of allMoves) {
      let score = 0;
      const [r, c] = m.to;

      // Prefer capturing player pieces (especially valuable ones)
      const target = pieces.find(p => p.row === r && p.col === c && p.owner === 1);
      if (target) {
        const pieceValues = {
          pawn: 1, lance: 3, knight: 4, silver: 5, gold: 6,
          bishop: 8, rook: 10,
          promotedPawn: 6, promotedLance: 6, promotedKnight: 6, promotedSilver: 6,
          promotedBishop: 10, promotedRook: 12,
        };
        score += 100 + (pieceValues[target.type] || 0);
      }

      // Prefer squares closer to center (more escape room)
      const centerDist = Math.abs(r - 4) + Math.abs(c - 4);
      score += (8 - centerDist);

      // Count adjacent squares within the board (more room = better)
      let adjacentCount = 0;
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) adjacentCount++;
      }
      score += adjacentCount;

      m.score = score;
    }
    allMoves.sort((a, b) => b.score - a.score);
    const move = allMoves[0];
    moveCount++;
    playKoma();

    if (move.type === 'king') {
      const capIdx = pieces.findIndex(p => p.row === move.to[0] && p.col === move.to[1] && p.owner === 1);
      if (capIdx >= 0) pieces.splice(capIdx, 1);
      king.row = move.to[0];
      king.col = move.to[1];
      lastMove = move.to;
    } else {
      const ep = pieces.find(p => p.row === move.piece.row && p.col === move.piece.col && p.owner === -1);
      const capIdx = pieces.findIndex(p => p.row === move.to[0] && p.col === move.to[1] && p.owner === 1);
      if (capIdx >= 0) pieces.splice(capIdx, 1);
      ep.row = move.to[0];
      ep.col = move.to[1];
      lastMove = move.to;
    }

    // Check if player exceeded move limit
    if (moveCount >= puzzle.maxMoves) {
      gameOver = true;
      gameResult = 'fail';
      render();
      return;
    }

    isPlayerTurn = true;
    render();
  }

  function isInCheck(pieceList, owner) {
    // Check if 'owner's king is in check
    const king = pieceList.find(p => p.type === 'king' && p.owner === owner);
    if (!king) return true;

    const ba = buildBoardArray(pieceList);
    const attacker = owner === 1 ? -1 : 1;

    for (const p of pieceList) {
      if (p.owner !== attacker) continue;
      const moves = getValidMoves(p.type, p.row, p.col, attacker, ba);
      if (moves.some(([r, c]) => r === king.row && c === king.col)) {
        return true;
      }
    }
    return false;
  }

  function isCheckmate(pieceList) {
    // Is enemy king in checkmate?
    if (!isInCheck(pieceList, -1)) return false;

    const king = pieceList.find(p => p.type === 'king' && p.owner === -1);
    if (!king) return true;

    const ba = buildBoardArray(pieceList);
    const kingMoves = getValidMoves('king', king.row, king.col, -1, ba);

    // Check if king can escape
    for (const [r, c] of kingMoves) {
      const tempPieces = JSON.parse(JSON.stringify(pieceList));
      const tempKing = tempPieces.find(p => p.type === 'king' && p.owner === -1);
      const capIdx = tempPieces.findIndex(p => p.row === r && p.col === c && p.owner === 1);
      if (capIdx >= 0) tempPieces.splice(capIdx, 1);
      tempKing.row = r;
      tempKing.col = c;
      if (!isInCheck(tempPieces, -1)) return false;
    }

    // Check if any enemy piece can block or capture
    const enemyPieces = pieceList.filter(p => p.owner === -1 && p.type !== 'king');
    for (const ep of enemyPieces) {
      const moves = getValidMoves(ep.type, ep.row, ep.col, -1, ba);
      for (const [r, c] of moves) {
        const tempPieces = JSON.parse(JSON.stringify(pieceList));
        const tempEp = tempPieces.find(p => p.row === ep.row && p.col === ep.col && p.owner === -1 && p.type === ep.type);
        const capIdx = tempPieces.findIndex(p => p.row === r && p.col === c && p.owner === 1);
        if (capIdx >= 0) tempPieces.splice(capIdx, 1);
        tempEp.row = r;
        tempEp.col = c;
        if (!isInCheck(tempPieces, -1)) return false;
      }
    }

    return true;
  }

  function renderGameOverOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'message-overlay';

    const box = document.createElement('div');
    box.className = 'message-box';

    if (gameResult === 'clear') {
      const h = document.createElement('h2');
      h.style.color = 'var(--color-success)';
      h.textContent = t('puzzleClear');
      box.appendChild(h);

      const p = document.createElement('p');
      p.textContent = t('puzzleClearMsg');
      box.appendChild(p);

      const menuBtn = document.createElement('button');
      menuBtn.className = 'btn btn-primary';
      menuBtn.textContent = t('backToMenu');
      menuBtn.addEventListener('click', () => navigate('tsumeMenu'));
      box.appendChild(menuBtn);
    } else {
      const h = document.createElement('h2');
      h.style.color = 'var(--color-error)';
      h.textContent = t('puzzleFail');
      box.appendChild(h);

      const p = document.createElement('p');
      p.textContent = t('puzzleFailMsg', { n: puzzle.maxMoves });
      box.appendChild(p);

      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn btn-accent';
      retryBtn.textContent = t('retryPuzzle');
      retryBtn.addEventListener('click', () => {
        navigate('tsumePlay', { puzzleIndex: params.puzzleIndex });
      });
      box.appendChild(retryBtn);

      const menuBtn = document.createElement('button');
      menuBtn.className = 'btn btn-outline';
      menuBtn.style.marginTop = '8px';
      menuBtn.textContent = t('backToMenu');
      menuBtn.addEventListener('click', () => navigate('tsumeMenu'));
      box.appendChild(menuBtn);
    }

    overlay.appendChild(box);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    app.appendChild(overlay);
  }

  render();
}
