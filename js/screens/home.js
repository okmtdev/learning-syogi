import { t, isKidsMode } from '../i18n.js';
import { CASTLE_CATEGORIES } from '../castles.js';
import { createBoard } from '../board.js';

function getRandomCastle() {
  const all = [];
  for (const cat of CASTLE_CATEGORIES) {
    for (const sub of cat.subcategories) {
      for (const castle of sub.castles) {
        all.push(castle);
      }
    }
  }
  return all[Math.floor(Math.random() * all.length)];
}

export function renderHome(app, navigate) {
  app.innerHTML = '';

  const title = document.createElement('h1');
  title.className = 'home-title';
  title.textContent = t('appTitle');
  app.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'home-subtitle';
  subtitle.textContent = t('appSubtitle');
  app.appendChild(subtitle);

  // Random castle showcase
  const castle = getRandomCastle();
  if (castle) {
    const showcase = document.createElement('div');
    showcase.style.display = 'flex';
    showcase.style.flexDirection = 'column';
    showcase.style.alignItems = 'center';
    showcase.style.marginBottom = '8px';

    const castleName = document.createElement('p');
    castleName.style.fontWeight = 'bold';
    castleName.style.color = 'var(--color-primary)';
    castleName.style.marginBottom = '4px';
    castleName.style.fontSize = '1rem';
    castleName.textContent = isKidsMode() ? castle.nameKids : castle.name;

    const container = document.createElement('div');
    container.className = 'board-container';
    container.style.margin = '0';
    const board = createBoard({
      pieces: castle.pieces,
      small: true,
    });
    container.appendChild(board);

    showcase.appendChild(castleName);
    showcase.appendChild(container);
    app.appendChild(showcase);
  }

  const menu = document.createElement('div');
  menu.className = 'menu-list';

  const items = [
    { label: 'menuPieceMove', target: 'pieceMenu' },
    { label: 'menuTsume', target: 'tsumeMenu' },
    { label: 'menuCastle', target: 'castleMenu' },
    { label: 'menuOption', target: 'options' },
  ];

  for (const item of items) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = t(item.label);
    btn.addEventListener('click', () => navigate(item.target));
    menu.appendChild(btn);
  }

  app.appendChild(menu);
}
