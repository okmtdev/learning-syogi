import { t } from '../i18n.js';
import { createBoard } from '../board.js';
import {
  PIECE_CHARS, PROMOTED_MAP, PIECE_EXPLAIN,
  getMovesForDisplay, getValidMoves, LEARNING_PIECES,
} from '../pieces.js';
import { playHatodokei } from '../audio.js';

// Show piece learning screen: normal + promoted moves, then test
export function renderPieceLearn(app, navigate, params) {
  const pieceType = params.piece;
  const promotedType = PROMOTED_MAP[pieceType] || null;

  let mode = 'normal'; // 'normal' | 'promoted' | 'test'
  let testState = null;

  function render() {
    app.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-back';
    backBtn.textContent = t('back');
    backBtn.addEventListener('click', () => {
      if (mode === 'test') {
        mode = promotedType ? 'promoted' : 'normal';
        render();
      } else if (mode === 'promoted') {
        mode = 'normal';
        render();
      } else {
        navigate('pieceMenu');
      }
    });
    app.appendChild(backBtn);

    if (mode === 'normal') {
      renderLearnMode(pieceType, false);
    } else if (mode === 'promoted') {
      renderLearnMode(promotedType, true);
    } else if (mode === 'test') {
      renderTestMode();
    }
  }

  function renderLearnMode(type, isPromotedView) {
    const title = document.createElement('h2');
    title.textContent = t(type);
    app.appendChild(title);

    // Tab row
    if (promotedType) {
      const tabRow = document.createElement('div');
      tabRow.className = 'tab-row';

      const normalTab = document.createElement('button');
      normalTab.className = 'tab-btn' + (!isPromotedView ? ' active' : '');
      normalTab.textContent = t('normalMove');
      normalTab.addEventListener('click', () => { mode = 'normal'; render(); });

      const promoTab = document.createElement('button');
      promoTab.className = 'tab-btn' + (isPromotedView ? ' active' : '');
      promoTab.textContent = t('promotedMove');
      promoTab.addEventListener('click', () => { mode = 'promoted'; render(); });

      tabRow.appendChild(normalTab);
      tabRow.appendChild(promoTab);
      app.appendChild(tabRow);
    }

    // Explanation
    const explainKey = PIECE_EXPLAIN[type];
    const box = document.createElement('div');
    box.className = 'explanation-box';
    box.textContent = t(explainKey);
    app.appendChild(box);

    // Board showing moves from center
    const moves = getMovesForDisplay(type, 1);
    const pieces = [{ type, row: 4, col: 4, owner: 1 }];

    const container = document.createElement('div');
    container.className = 'board-container';
    const board = createBoard({
      pieces,
      highlighted: moves,
      selected: [4, 4],
    });
    container.appendChild(board);
    app.appendChild(container);

    // Legend
    const legend = document.createElement('div');
    legend.className = 'arrow-legend';
    legend.innerHTML = `
      <span><span class="dot dot-selected"></span> ${t(PIECE_CHARS[type])}</span>
      <span><span class="dot dot-move"></span> ${t('normalMove')}</span>
    `;
    app.appendChild(legend);

    // Test button
    const testBtn = document.createElement('button');
    testBtn.className = 'btn btn-accent';
    testBtn.style.marginTop = '16px';
    testBtn.textContent = t('startTest');
    testBtn.addEventListener('click', () => {
      mode = 'test';
      testState = createTestState();
      playHatodokei();
      render();
    });
    app.appendChild(testBtn);
  }

  function createTestState() {
    // Generate 3 questions: place piece at random positions, ask which cells it can move to
    const questions = [];
    const types = [pieceType];
    if (promotedType) types.push(promotedType);

    for (let i = 0; i < 3; i++) {
      const type = types[i % types.length];
      // Random position not on edges for more interesting moves
      const row = 2 + Math.floor(Math.random() * 5);
      const col = 2 + Math.floor(Math.random() * 5);
      const moves = getValidMoves(type, row, col, 1, null);
      questions.push({ type, row, col, correctMoves: moves, userMoves: [], answered: false, correct: false });
    }
    return { questions, current: 0 };
  }

  function renderTestMode() {
    const title = document.createElement('h2');
    title.textContent = `${t('testTitle')} (${testState.current + 1}/3)`;
    app.appendChild(title);

    const q = testState.questions[testState.current];

    if (q.answered) {
      renderTestResult(q);
      return;
    }

    const instruction = document.createElement('div');
    instruction.className = 'explanation-box';
    instruction.textContent = t('testInstruction');
    app.appendChild(instruction);

    const pieces = [{ type: q.type, row: q.row, col: q.col, owner: 1 }];

    const container = document.createElement('div');
    container.className = 'board-container';

    const renderBoard = () => {
      container.innerHTML = '';
      const board = createBoard({
        pieces,
        highlighted: q.userMoves,
        selected: [q.row, q.col],
        onCellClick: (r, c) => {
          if (r === q.row && c === q.col) return;
          const key = `${r},${c}`;
          const idx = q.userMoves.findIndex(([mr,mc]) => `${mr},${mc}` === key);
          if (idx >= 0) {
            q.userMoves.splice(idx, 1);
          } else {
            q.userMoves.push([r, c]);
          }
          renderBoard();
        },
      });
      container.appendChild(board);
    };

    renderBoard();
    app.appendChild(container);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn btn-success';
    checkBtn.style.marginTop = '8px';
    checkBtn.textContent = t('checkAnswer');
    checkBtn.addEventListener('click', () => {
      // Compare
      const correctSet = new Set(q.correctMoves.map(([r,c]) => `${r},${c}`));
      const userSet = new Set(q.userMoves.map(([r,c]) => `${r},${c}`));
      q.correct = correctSet.size === userSet.size && [...correctSet].every(k => userSet.has(k));
      q.answered = true;
      render();
    });
    app.appendChild(checkBtn);
  }

  function renderTestResult(q) {
    const correctSet = new Set(q.correctMoves.map(([r,c]) => `${r},${c}`));
    const userSet = new Set(q.userMoves.map(([r,c]) => `${r},${c}`));

    // correct cells: user selected & actually correct
    const correctCells = q.userMoves.filter(([r,c]) => correctSet.has(`${r},${c}`));
    // wrong cells: user selected but not correct
    const wrongCells = q.userMoves.filter(([r,c]) => !correctSet.has(`${r},${c}`));
    // missed cells: correct but not selected by user
    const missedCells = q.correctMoves.filter(([r,c]) => !userSet.has(`${r},${c}`));

    const msgBox = document.createElement('div');
    msgBox.className = 'explanation-box';
    msgBox.innerHTML = q.correct
      ? `<strong style="color:var(--color-success)">${t('correct')}</strong>`
      : `<strong style="color:var(--color-error)">${t('incorrect')}</strong>`;
    app.appendChild(msgBox);

    const pieces = [{ type: q.type, row: q.row, col: q.col, owner: 1 }];
    const container = document.createElement('div');
    container.className = 'board-container';
    const board = createBoard({
      pieces,
      selected: [q.row, q.col],
      correctCells,
      wrongCells,
      missedCells,
    });
    container.appendChild(board);
    app.appendChild(container);

    const legend = document.createElement('div');
    legend.className = 'arrow-legend arrow-legend-lg';
    legend.innerHTML = `
      <span><span class="dot" style="background:rgba(76,175,80,0.5);border:1px solid #4caf50"></span> ${t('legendCorrect')}</span>
      <span><span class="dot" style="background:rgba(229,57,53,0.4);border:1px solid #e53935"></span> ${t('legendWrong')}</span>
      <span><span class="dot" style="background:rgba(0,120,0,0.6);border:1px solid #006600"></span> ${t('legendMissed')}</span>
    `;
    app.appendChild(legend);

    if (testState.current < 2) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-accent';
      nextBtn.style.marginTop = '12px';
      nextBtn.textContent = q.correct ? t('nextQuestion') : t('retry');
      nextBtn.addEventListener('click', () => {
        if (!q.correct) {
          q.userMoves = [];
          q.answered = false;
        } else {
          testState.current++;
        }
        render();
      });
      app.appendChild(nextBtn);
    } else {
      // Last question
      if (q.correct) {
        const doneBox = document.createElement('div');
        doneBox.className = 'explanation-box';
        doneBox.innerHTML = `<strong style="color:var(--color-success)">${t('testComplete')}</strong><br>${t('testCompleteMsg')}`;
        app.appendChild(doneBox);
      }

      const btnRow = document.createElement('div');
      btnRow.style.display = 'flex';
      btnRow.style.gap = '8px';
      btnRow.style.marginTop = '12px';

      if (!q.correct) {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn-accent';
        retryBtn.textContent = t('retry');
        retryBtn.addEventListener('click', () => {
          q.userMoves = [];
          q.answered = false;
          render();
        });
        btnRow.appendChild(retryBtn);
      }

      const menuBtn = document.createElement('button');
      menuBtn.className = 'btn btn-primary';
      menuBtn.textContent = t('backToMenu');
      menuBtn.addEventListener('click', () => navigate('pieceMenu'));
      btnRow.appendChild(menuBtn);

      app.appendChild(btnRow);
    }
  }

  render();
}
