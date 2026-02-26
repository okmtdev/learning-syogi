import { loadSettings } from './storage.js';
import { setKidsMode } from './i18n.js';
import { renderHome } from './screens/home.js';
import { renderPieceMenu } from './screens/pieceMenu.js';
import { renderPieceLearn } from './screens/pieceLearn.js';
import { renderTsumeMenu } from './screens/tsumeMenu.js';
import { renderTsumePlay } from './screens/tsumePlay.js';
import { renderOptions } from './screens/options.js';

const app = document.getElementById('app');

// Load settings and apply kids mode
const settings = loadSettings();
setKidsMode(settings.kidsMode);

// Simple router
function navigate(screen, params = {}) {
  window.scrollTo(0, 0);
  switch (screen) {
    case 'home':
      renderHome(app, navigate);
      break;
    case 'pieceMenu':
      renderPieceMenu(app, navigate);
      break;
    case 'pieceLearn':
      renderPieceLearn(app, navigate, params);
      break;
    case 'tsumeMenu':
      renderTsumeMenu(app, navigate);
      break;
    case 'tsumePlay':
      renderTsumePlay(app, navigate, params);
      break;
    case 'options':
      renderOptions(app, navigate, params, () => {
        // Re-render options when settings change (for language toggle)
      });
      break;
    default:
      renderHome(app, navigate);
  }
}

// Start
navigate('home');
