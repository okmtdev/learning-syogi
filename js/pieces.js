// Piece types and movement definitions for Shogi
// Board is 9x9, row 0 = top (opponent side), row 8 = bottom (player side)
// col 0 = left from player perspective

export const PIECE_TYPES = {
  KING: 'king',
  ROOK: 'rook',
  BISHOP: 'bishop',
  GOLD: 'gold',
  SILVER: 'silver',
  KNIGHT: 'knight',
  LANCE: 'lance',
  PAWN: 'pawn',
  P_ROOK: 'promotedRook',
  P_BISHOP: 'promotedBishop',
  P_SILVER: 'promotedSilver',
  P_KNIGHT: 'promotedKnight',
  P_LANCE: 'promotedLance',
  P_PAWN: 'promotedPawn',
};

// Character displayed on the board (short)
export const PIECE_CHARS = {
  king: 'charKing',
  rook: 'charRook',
  bishop: 'charBishop',
  gold: 'charGold',
  silver: 'charSilver',
  knight: 'charKnight',
  lance: 'charLance',
  pawn: 'charPawn',
  promotedRook: 'charPromotedRook',
  promotedBishop: 'charPromotedBishop',
  promotedSilver: 'charPromotedSilver',
  promotedKnight: 'charPromotedKnight',
  promotedLance: 'charPromotedLance',
  promotedPawn: 'charPromotedPawn',
};

// Promoted versions
export const PROMOTED_MAP = {
  rook: 'promotedRook',
  bishop: 'promotedBishop',
  silver: 'promotedSilver',
  knight: 'promotedKnight',
  lance: 'promotedLance',
  pawn: 'promotedPawn',
};

// Whether a piece is promoted
export function isPromoted(type) {
  return type.startsWith('promoted');
}

// Explanation key
export const PIECE_EXPLAIN = {
  king: 'explainKing',
  rook: 'explainRook',
  bishop: 'explainBishop',
  gold: 'explainGold',
  silver: 'explainSilver',
  knight: 'explainKnight',
  lance: 'explainLance',
  pawn: 'explainPawn',
  promotedRook: 'explainPromotedRook',
  promotedBishop: 'explainPromotedBishop',
  promotedSilver: 'explainPromotedGeneric',
  promotedKnight: 'explainPromotedGeneric',
  promotedLance: 'explainPromotedGeneric',
  promotedPawn: 'explainPromotedGeneric',
};

// The 8 base pieces for learning menu
export const LEARNING_PIECES = [
  'king', 'rook', 'bishop', 'gold', 'silver', 'knight', 'lance', 'pawn',
];

// Movement offsets for pieces: { steps: [[dr, dc], ...], slide: boolean }
// "player" pieces move upward (negative row), direction multiplied by owner
// For slide pieces, we define direction vectors and slide along them

function getStepMoves(pieceType, owner) {
  // owner: 1 = player (moves up, dr negative), -1 = enemy (moves down, dr positive)
  const dir = owner === 1 ? -1 : 1; // row direction

  switch (pieceType) {
    case 'king':
      return { steps: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]], slide: false };
    case 'gold':
      return { steps: [[dir,-1],[dir,0],[dir,1],[0,-1],[0,1],[-dir,0]], slide: false };
    case 'silver':
      return { steps: [[dir,-1],[dir,0],[dir,1],[-dir,-1],[-dir,1]], slide: false };
    case 'knight':
      return { steps: [[dir*2, -1],[dir*2, 1]], slide: false };
    case 'pawn':
      return { steps: [[dir, 0]], slide: false };
    case 'lance':
      return { steps: [[dir, 0]], slide: true }; // slides forward only
    case 'rook':
      return { steps: [[-1,0],[1,0],[0,-1],[0,1]], slide: true };
    case 'bishop':
      return { steps: [[-1,-1],[-1,1],[1,-1],[1,1]], slide: true };
    case 'promotedRook':
      // Rook + diagonal 1 step
      return {
        slideSteps: [[-1,0],[1,0],[0,-1],[0,1]],
        oneSteps: [[-1,-1],[-1,1],[1,-1],[1,1]],
        mixed: true,
      };
    case 'promotedBishop':
      // Bishop + orthogonal 1 step
      return {
        slideSteps: [[-1,-1],[-1,1],[1,-1],[1,1]],
        oneSteps: [[-1,0],[1,0],[0,-1],[0,1]],
        mixed: true,
      };
    // All other promoted pieces move like gold
    case 'promotedSilver':
    case 'promotedKnight':
    case 'promotedLance':
    case 'promotedPawn':
      return { steps: [[dir,-1],[dir,0],[dir,1],[0,-1],[0,1],[-dir,0]], slide: false };
    default:
      return { steps: [], slide: false };
  }
}

// Get all valid move positions for a piece on a board
// board: 9x9 array, each cell is null or { type, owner }
// owner: 1 = player, -1 = enemy
export function getValidMoves(pieceType, row, col, owner, board) {
  const moves = [];
  const moveDef = getStepMoves(pieceType, owner);

  if (moveDef.mixed) {
    // Slide directions
    for (const [dr, dc] of moveDef.slideSteps) {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 9 && c >= 0 && c < 9) {
        if (board && board[r][c]) {
          if (board[r][c].owner !== owner) moves.push([r, c]);
          break;
        }
        moves.push([r, c]);
        r += dr;
        c += dc;
      }
    }
    // One-step directions
    for (const [dr, dc] of moveDef.oneSteps) {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < 9 && c >= 0 && c < 9) {
        if (!board || !board[r][c] || board[r][c].owner !== owner) {
          moves.push([r, c]);
        }
      }
    }
  } else if (moveDef.slide) {
    for (const [dr, dc] of moveDef.steps) {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 9 && c >= 0 && c < 9) {
        if (board && board[r][c]) {
          if (board[r][c].owner !== owner) moves.push([r, c]);
          break;
        }
        moves.push([r, c]);
        r += dr;
        c += dc;
      }
    }
  } else {
    for (const [dr, dc] of moveDef.steps) {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < 9 && c >= 0 && c < 9) {
        if (!board || !board[r][c] || board[r][c].owner !== owner) {
          moves.push([r, c]);
        }
      }
    }
  }

  return moves;
}

// For learning display: get move offsets (no board blocking) from center position
export function getMovesForDisplay(pieceType, owner) {
  const centerRow = 4, centerCol = 4;
  return getValidMoves(pieceType, centerRow, centerCol, owner, null);
}
