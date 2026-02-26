import { t } from '../i18n.js';
import { LEARNING_PIECES, PIECE_CHARS } from '../pieces.js';

export function renderPieceMenu(app, navigate) {
  app.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-back';
  backBtn.textContent = t('back');
  backBtn.addEventListener('click', () => navigate('home'));
  app.appendChild(backBtn);

  const heading = document.createElement('h2');
  heading.textContent = t('learnPieces');
  app.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'piece-grid';

  for (const piece of LEARNING_PIECES) {
    const card = document.createElement('div');
    card.className = 'piece-card';

    const icon = document.createElement('div');
    icon.className = 'piece-icon';
    icon.textContent = t(PIECE_CHARS[piece]);

    const label = document.createElement('div');
    label.className = 'piece-label';
    label.textContent = t(piece);

    card.appendChild(icon);
    card.appendChild(label);
    card.addEventListener('click', () => navigate('pieceLearn', { piece }));
    grid.appendChild(card);
  }

  app.appendChild(grid);
}
