// Tsume shogi puzzle definitions
// Each puzzle defines the board state. The game engine validates moves at runtime.
// owner: 1 = player (bottom), -1 = enemy (top)

export const PUZZLES = [
  // Puzzle 1: 1手詰め - Drop Gold (頭金)
  // Enemy king at (0,0). Player lance at (4,0) covers col 0.
  // Solution: Drop gold at (1,0) → checkmate.
  {
    id: 'tsume1',
    name: '第1問',
    description: '1手詰め',
    descriptionKids: '1てづめ',
    pieces: [
      { type: 'king', row: 0, col: 0, owner: -1 },
      { type: 'lance', row: 4, col: 0, owner: 1 },
    ],
    hand: [{ type: 'gold', count: 1 }],
    maxMoves: 1,
    hintText: '金を打って詰ませよう！',
    hintTextKids: 'きんを うって つませよう！',
  },

  // Puzzle 2: 1手詰め - Drop Rook
  // Enemy king at (0,8). Player gold at (2,7).
  // Solution: Drop rook at (0,7) → checkmate.
  {
    id: 'tsume2',
    name: '第2問',
    description: '1手詰め',
    descriptionKids: '1てづめ',
    pieces: [
      { type: 'king', row: 0, col: 8, owner: -1 },
      { type: 'gold', row: 2, col: 7, owner: 1 },
    ],
    hand: [{ type: 'rook', count: 1 }],
    maxMoves: 1,
    hintText: '飛車を打って詰ませよう！',
    hintTextKids: 'ひしゃを うって つませよう！',
  },

  // Puzzle 3: 3手詰め - Rook + Gold
  // Enemy king at (0,1), enemy pawn at (0,0). Player pawn at (2,0).
  // Hand: Rook x1, Gold x1.
  // Move 1: Drop rook at (0,2) → check, king forced to (1,1).
  // Move 2 (enemy): King (0,1) → (1,1).
  // Move 3: Drop gold at (2,1) → checkmate.
  {
    id: 'tsume3',
    name: '第3問',
    description: '3手詰め',
    descriptionKids: '3てづめ',
    pieces: [
      { type: 'king', row: 0, col: 1, owner: -1 },
      { type: 'pawn', row: 0, col: 0, owner: -1 },
      { type: 'pawn', row: 2, col: 0, owner: 1 },
    ],
    hand: [{ type: 'rook', count: 1 }, { type: 'gold', count: 1 }],
    maxMoves: 3,
    hintText: '飛車と金を使って3手で詰ませよう！',
    hintTextKids: 'ひしゃと きんを つかって 3てで つませよう！',
  },
];
