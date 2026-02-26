import { t } from '../i18n.js';
import { isPuzzleCleared } from '../storage.js';
import { PUZZLES } from '../puzzles.js';

export function renderTsumeMenu(app, navigate) {
  app.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-back';
  backBtn.textContent = t('back');
  backBtn.addEventListener('click', () => navigate('home'));
  app.appendChild(backBtn);

  const title = document.createElement('h2');
  title.textContent = t('tsumeTitle');
  app.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = t('tsumeSelect');
  sub.style.textAlign = 'center';
  sub.style.marginBottom = '16px';
  app.appendChild(sub);

  for (let i = 0; i < PUZZLES.length; i++) {
    const puzzle = PUZZLES[i];
    const cleared = isPuzzleCleared(puzzle.id);

    const card = document.createElement('div');
    card.className = 'puzzle-card';

    const titleEl = document.createElement('div');
    titleEl.className = 'puzzle-title';
    titleEl.textContent = puzzle.name;

    const status = document.createElement('div');
    status.className = 'puzzle-status ' + (cleared ? 'cleared' : 'not-cleared');
    status.textContent = cleared ? t('cleared') : t('notCleared');

    card.appendChild(titleEl);
    card.appendChild(status);
    card.addEventListener('click', () => navigate('tsumePlay', { puzzleIndex: i }));
    app.appendChild(card);
  }
}
