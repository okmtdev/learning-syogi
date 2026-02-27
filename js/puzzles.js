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
  // Enemy king at (0,8). Player gold at (1,7) covers (0,7),(1,8).
  // Solution: Drop rook at (0,7) → checkmate.
  // King can't go (0,7): gold protects. (1,7): rook attacks via column. (1,8): gold attacks.
  {
    id: 'tsume2',
    name: '第2問',
    description: '1手詰め',
    descriptionKids: '1てづめ',
    pieces: [
      { type: 'king', row: 0, col: 8, owner: -1 },
      { type: 'gold', row: 1, col: 7, owner: 1 },
    ],
    hand: [{ type: 'rook', count: 1 }],
    maxMoves: 1,
    hintText: '飛車を打って詰ませよう！',
    hintTextKids: 'ひしゃを うって つませよう！',
  },

  // Puzzle 3: 3手詰め - 送り金 (Sending Gold)
  // Enemy king at (1,2). Player lance at (4,0) covers col 0.
  // Player silver at (3,3) protects (2,2) and (2,3).
  // Hand: Gold x2.
  // Move 1: Drop gold at (2,2) → check. Silver protects, king can't capture.
  //   King escapes to (0,1), (0,2), or (0,3).
  // Move 2 (enemy): King escapes.
  // Move 3: Drop gold adjacent to king → checkmate (送り金).
  //   e.g. king at (0,2) → gold at (1,2) mates.
  {
    id: 'tsume3',
    name: '第3問',
    description: '3手詰め',
    descriptionKids: '3てづめ',
    pieces: [
      { type: 'king', row: 1, col: 2, owner: -1 },
      { type: 'lance', row: 4, col: 0, owner: 1 },
      { type: 'silver', row: 3, col: 3, owner: 1 },
    ],
    hand: [{ type: 'gold', count: 2 }],
    maxMoves: 3,
    hintText: '金を使って追い詰めよう！',
    hintTextKids: 'きんを つかって おいつめよう！',
  },

  // Puzzle 4: 3手詰め - 銀取り＋頭金 (Silver capture + Head Gold)
  // Enemy king at (0,8). Enemy pawn at (1,7) shields king.
  // Player silver at (2,6) can capture pawn. Player lance at (4,7) covers col 7.
  // Hand: Gold x1.
  // Move 1: Silver captures pawn at (1,7) → check. Lance protects silver.
  // Move 2 (enemy): King forced to (1,8) (only escape).
  // Move 3: Drop gold at (0,8) → checkmate (頭金).
  {
    id: 'tsume4',
    name: '第4問',
    description: '3手詰め',
    descriptionKids: '3てづめ',
    pieces: [
      { type: 'king', row: 0, col: 8, owner: -1 },
      { type: 'pawn', row: 1, col: 7, owner: -1 },
      { type: 'silver', row: 2, col: 6, owner: 1 },
      { type: 'lance', row: 4, col: 7, owner: 1 },
    ],
    hand: [{ type: 'gold', count: 1 }],
    maxMoves: 3,
    hintText: '銀で歩を取って王手！',
    hintTextKids: 'ぎんで ふを とって おうて！',
  },

  // Puzzle 5: 3手詰め - 送り金・端 (Sending Gold, corner)
  // Enemy king at (1,0). Player silver at (3,1) protects (2,0) and (2,1).
  // Hand: Gold x2.
  // Move 1: Drop gold at (2,0) → check. Silver protects gold.
  //   King escapes to (0,0) or (0,1).
  // Move 2 (enemy): King escapes.
  // Move 3: Drop gold → checkmate (送り金).
  {
    id: 'tsume5',
    name: '第5問',
    description: '3手詰め',
    descriptionKids: '3てづめ',
    pieces: [
      { type: 'king', row: 1, col: 0, owner: -1 },
      { type: 'silver', row: 3, col: 1, owner: 1 },
    ],
    hand: [{ type: 'gold', count: 2 }],
    maxMoves: 3,
    hintText: '金を送って追い詰めよう！',
    hintTextKids: 'きんを おくって おいつめよう！',
  },

  // Puzzle 6: 3手詰め - 送り金・中央 (Sending Gold, center)
  // Enemy king at (1,4). Enemy pawn at (3,4) blocks lance.
  // Player silver at (3,5) protects (2,4) and (2,5).
  // Player lance at (5,4) covers col 4 (behind pawn).
  // Hand: Gold x2.
  // Move 1: Drop gold at (2,4) → check. Silver protects gold.
  //   King escapes to (0,3), (0,4), or (0,5).
  // Move 2 (enemy): King escapes.
  // Move 3: Drop gold adjacent → checkmate (送り金).
  {
    id: 'tsume6',
    name: '第6問',
    description: '3手詰め',
    descriptionKids: '3てづめ',
    pieces: [
      { type: 'king', row: 1, col: 4, owner: -1 },
      { type: 'pawn', row: 3, col: 4, owner: -1 },
      { type: 'silver', row: 3, col: 5, owner: 1 },
      { type: 'lance', row: 5, col: 4, owner: 1 },
    ],
    hand: [{ type: 'gold', count: 2 }],
    maxMoves: 3,
    hintText: '金を送って追い詰めよう！',
    hintTextKids: 'きんを おくって おいつめよう！',
  },
];
