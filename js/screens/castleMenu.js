import { t, isKidsMode } from '../i18n.js';
import { CASTLE_CATEGORIES } from '../castles.js';
import { createBoard } from '../board.js';

export function renderCastleMenu(app, navigate) {
  app.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-back';
  backBtn.textContent = t('back');
  backBtn.addEventListener('click', () => navigate('home'));
  app.appendChild(backBtn);

  const title = document.createElement('h2');
  title.textContent = t('menuCastle');
  app.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = t('castleSelect');
  sub.style.textAlign = 'center';
  sub.style.marginBottom = '16px';
  app.appendChild(sub);

  for (const category of CASTLE_CATEGORIES) {
    const catTitle = document.createElement('h3');
    catTitle.style.color = 'var(--color-primary)';
    catTitle.style.marginTop = '16px';
    catTitle.style.marginBottom = '8px';
    catTitle.textContent = isKidsMode() ? category.nameKids : category.name;
    app.appendChild(catTitle);

    for (const subcat of category.subcategories) {
      const subcatTitle = document.createElement('div');
      subcatTitle.style.fontWeight = 'bold';
      subcatTitle.style.fontSize = '0.95rem';
      subcatTitle.style.color = '#666';
      subcatTitle.style.marginTop = '10px';
      subcatTitle.style.marginBottom = '6px';
      subcatTitle.textContent = isKidsMode() ? subcat.nameKids : subcat.name;
      app.appendChild(subcatTitle);

      for (const castle of subcat.castles) {
        const card = document.createElement('div');
        card.className = 'puzzle-card';

        const titleEl = document.createElement('div');
        titleEl.className = 'puzzle-title';
        titleEl.textContent = isKidsMode() ? castle.nameKids : castle.name;

        const arrow = document.createElement('div');
        arrow.style.color = '#999';
        arrow.style.fontSize = '1.2rem';
        arrow.textContent = '→';

        card.appendChild(titleEl);
        card.appendChild(arrow);
        card.addEventListener('click', () => {
          navigate('castleDetail', { categoryId: category.id, subcategoryId: subcat.id, castleId: castle.id });
        });
        app.appendChild(card);
      }
    }
  }
}

export function renderCastleDetail(app, navigate, params) {
  app.innerHTML = '';

  // Find the castle
  let castle = null;
  let categoryName = '';
  for (const cat of CASTLE_CATEGORIES) {
    if (cat.id !== params.categoryId) continue;
    for (const subcat of cat.subcategories) {
      if (subcat.id !== params.subcategoryId) continue;
      castle = subcat.castles.find(c => c.id === params.castleId);
      categoryName = isKidsMode() ? subcat.nameKids : subcat.name;
    }
  }

  if (!castle) {
    navigate('castleMenu');
    return;
  }

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-back';
  backBtn.textContent = t('back');
  backBtn.addEventListener('click', () => navigate('castleMenu'));
  app.appendChild(backBtn);

  const subtitle = document.createElement('p');
  subtitle.style.textAlign = 'center';
  subtitle.style.color = '#888';
  subtitle.style.fontSize = '0.9rem';
  subtitle.style.marginBottom = '4px';
  subtitle.textContent = categoryName;
  app.appendChild(subtitle);

  const title = document.createElement('h2');
  title.textContent = isKidsMode() ? castle.nameKids : castle.name;
  app.appendChild(title);

  const desc = document.createElement('div');
  desc.className = 'explanation-box';
  desc.textContent = isKidsMode() ? castle.descriptionKids : castle.description;
  app.appendChild(desc);

  // Board display
  const container = document.createElement('div');
  container.className = 'board-container';
  const board = createBoard({
    pieces: castle.pieces,
  });
  container.appendChild(board);
  app.appendChild(container);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'arrow-legend';
  legend.style.marginTop = '8px';
  legend.textContent = t('castleBoardHint');
  app.appendChild(legend);

  // Back to list button
  const menuBtn = document.createElement('button');
  menuBtn.className = 'btn btn-primary';
  menuBtn.style.marginTop = '16px';
  menuBtn.textContent = t('castleBackToList');
  menuBtn.addEventListener('click', () => navigate('castleMenu'));
  app.appendChild(menuBtn);
}
