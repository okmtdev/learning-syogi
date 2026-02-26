// Text map: key -> [standard, hiragana]
const textMap = {
  // Home
  appTitle: ['将棋基礎練習', 'しょうぎ きそれんしゅう'],
  appSubtitle: ['子供から大人まで楽しく学ぼう！', 'たのしく まなぼう！'],
  menuPieceMove: ['駒の動き', 'こまの うごき'],
  menuTsume: ['詰将棋', 'つめしょうぎ'],
  menuOption: ['オプション', 'おぷしょん'],

  // Piece names
  king: ['王将', 'おうしょう'],
  rook: ['飛車', 'ひしゃ'],
  bishop: ['角行', 'かくぎょう'],
  gold: ['金将', 'きんしょう'],
  silver: ['銀将', 'ぎんしょう'],
  knight: ['桂馬', 'けいま'],
  lance: ['香車', 'きょうしゃ'],
  pawn: ['歩兵', 'ふひょう'],
  promotedRook: ['龍王', 'りゅうおう'],
  promotedBishop: ['龍馬', 'りゅうま'],
  promotedSilver: ['成銀', 'なりぎん'],
  promotedKnight: ['成桂', 'なりけい'],
  promotedLance: ['成香', 'なりきょう'],
  promotedPawn: ['と金', 'ときん'],

  // Short piece chars for board
  charKing: ['王', 'おう'],
  charRook: ['飛', 'ひ'],
  charBishop: ['角', 'かく'],
  charGold: ['金', 'きん'],
  charSilver: ['銀', 'ぎん'],
  charKnight: ['桂', 'けい'],
  charLance: ['香', 'きょ'],
  charPawn: ['歩', 'ふ'],
  charPromotedRook: ['龍', 'りゅ'],
  charPromotedBishop: ['馬', 'うま'],
  charPromotedSilver: ['全', 'ぜん'],
  charPromotedKnight: ['圭', 'けい'],
  charPromotedLance: ['杏', 'あん'],
  charPromotedPawn: ['と', 'と'],

  // UI
  back: ['← 戻る', '← もどる'],
  learnPieces: ['駒を選んでね', 'こまを えらんでね'],
  normalMove: ['通常の動き', 'ふつうの うごき'],
  promotedMove: ['成った時の動き', 'なったときの うごき'],
  startTest: ['テストに挑戦！', 'てすとに ちょうせん！'],
  testTitle: ['テスト', 'てすと'],
  testInstruction: ['この駒が動けるマスを全てタップしてください', 'このこまが うごける ますを ぜんぶ たっぷして ください'],
  checkAnswer: ['答え合わせ', 'こたえあわせ'],
  correct: ['正解！', 'せいかい！'],
  incorrect: ['おしい！もう一度やってみよう', 'おしい！もういちど やってみよう'],
  nextQuestion: ['次の問題', 'つぎの もんだい'],
  retry: ['もう一度', 'もういちど'],
  testComplete: ['テスト完了！', 'てすと かんりょう！'],
  testCompleteMsg: ['よくできました！全問正解です！', 'よくできました！ぜんもん せいかい です！'],
  backToMenu: ['メニューに戻る', 'めにゅーに もどる'],

  // Tsume
  tsumeTitle: ['詰将棋', 'つめしょうぎ'],
  tsumeSelect: ['問題を選んでね', 'もんだいを えらんでね'],
  cleared: ['クリア済み', 'くりあずみ'],
  notCleared: ['未クリア', 'まだ'],
  yourTurn: ['あなたの番です。王手をかけてください', 'あなたの ばんです。おうてを かけてください'],
  enemyTurn: ['相手の番です...', 'あいての ばんです...'],
  puzzleClear: ['クリア！', 'くりあ！'],
  puzzleClearMsg: ['見事に詰みました！おめでとう！', 'みごとに つみました！おめでとう！'],
  puzzleFail: ['失敗...', 'しっぱい...'],
  puzzleFailMsg: ['3手で詰みませんでした。もう一度挑戦しよう！', '3てで つみませんでした。もういちど ちょうせんしよう！'],
  retryPuzzle: ['最初からやり直す', 'さいしょから やりなおす'],
  moveCount: ['手数', 'てすう'],
  selectPiece: ['持ち駒を選んでから打つ場所をタップ', 'もちごまを えらんでから うつ ばしょを たっぷ'],
  hand: ['持ち駒', 'もちごま'],

  // Options
  optionTitle: ['オプション', 'おぷしょん'],
  seLabel: ['SE（効果音）', 'こうかおん'],
  seVolume: ['音量', 'おんりょう'],
  kidsMode: ['お子様向け', 'おこさまむけ'],
  kidsModeDesc: ['全ての文字をひらがなにします', 'ぜんぶの もじを ひらがなに します'],

  // Piece explanations
  explainKing: [
    '王将は全方向に1マス動けます。将棋で最も大事な駒です。',
    'おうしょうは ぜんほうこうに 1ます うごけます。しょうぎで いちばん だいじな こまです。',
  ],
  explainRook: [
    '飛車は上下左右にどこまでも動けます。とても強力な駒です。',
    'ひしゃは うえした ひだりみぎに どこまでも うごけます。とても つよい こまです。',
  ],
  explainBishop: [
    '角行は斜め方向にどこまでも動けます。',
    'かくぎょうは ななめほうこうに どこまでも うごけます。',
  ],
  explainGold: [
    '金将は前3方向、横、後ろに1マス動けます。斜め後ろには動けません。',
    'きんしょうは まえ3ほうこう、よこ、うしろに 1ます うごけます。ななめ うしろには うごけません。',
  ],
  explainSilver: [
    '銀将は前3方向と斜め後ろに1マス動けます。横と真後ろには動けません。',
    'ぎんしょうは まえ3ほうこうと ななめ うしろに 1ます うごけます。よこと まうしろには うごけません。',
  ],
  explainKnight: [
    '桂馬は前方2マス先の左右に飛びます。他の駒を飛び越えられる唯一の駒です。',
    'けいまは まえ2ます さきの ひだりみぎに とびます。ほかの こまを とびこえられる ゆいいつの こまです。',
  ],
  explainLance: [
    '香車は前方にどこまでも進めますが、横や後ろには動けません。',
    'きょうしゃは まえに どこまでも すすめますが、よこや うしろには うごけません。',
  ],
  explainPawn: [
    '歩兵は前に1マスだけ動けます。一番たくさんある駒です。',
    'ふひょうは まえに 1ます だけ うごけます。いちばん たくさんある こまです。',
  ],
  explainPromotedRook: [
    '龍王は飛車の動きに加えて、斜めにも1マス動けるようになります。',
    'りゅうおうは ひしゃの うごきに くわえて、ななめにも 1ます うごけるように なります。',
  ],
  explainPromotedBishop: [
    '龍馬は角行の動きに加えて、上下左右にも1マス動けるようになります。',
    'りゅうまは かくぎょうの うごきに くわえて、うえした ひだりみぎにも 1ます うごけるように なります。',
  ],
  explainPromotedGeneric: [
    'この駒は成ると金将と同じ動きになります。',
    'このこまは なると きんしょうと おなじ うごきに なります。',
  ],
};

let kidsMode = false;

export function setKidsMode(val) {
  kidsMode = val;
}

export function isKidsMode() {
  return kidsMode;
}

export function t(key) {
  const entry = textMap[key];
  if (!entry) return key;
  return kidsMode ? entry[1] : entry[0];
}
