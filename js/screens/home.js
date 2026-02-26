import { t } from '../i18n.js';

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

  const menu = document.createElement('div');
  menu.className = 'menu-list';

  const items = [
    { label: 'menuPieceMove', target: 'pieceMenu' },
    { label: 'menuTsume', target: 'tsumeMenu' },
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
