import { t } from '../i18n.js';
import { loadSettings, saveSettings } from '../storage.js';
import { setKidsMode } from '../i18n.js';

export function renderOptions(app, navigate, params, onSettingsChange) {
  const settings = loadSettings();

  app.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-back';
  backBtn.textContent = t('back');
  backBtn.addEventListener('click', () => navigate('home'));
  app.appendChild(backBtn);

  const title = document.createElement('h2');
  title.textContent = t('optionTitle');
  app.appendChild(title);

  // SE toggle
  const seRow = document.createElement('div');
  seRow.className = 'option-row';

  const seLabel = document.createElement('label');
  seLabel.textContent = t('seLabel');

  const seToggle = document.createElement('label');
  seToggle.className = 'toggle';
  const seInput = document.createElement('input');
  seInput.type = 'checkbox';
  seInput.checked = settings.seEnabled;
  seInput.addEventListener('change', () => {
    settings.seEnabled = seInput.checked;
    saveSettings(settings);
    render();
  });
  const seSlider = document.createElement('span');
  seSlider.className = 'toggle-slider';
  seToggle.appendChild(seInput);
  seToggle.appendChild(seSlider);

  seRow.appendChild(seLabel);
  seRow.appendChild(seToggle);
  app.appendChild(seRow);

  // Volume slider (only visible when SE is on)
  if (settings.seEnabled) {
    const volRow = document.createElement('div');
    volRow.className = 'option-row';

    const volLabel = document.createElement('label');
    volLabel.textContent = t('seVolume');

    const volControl = document.createElement('div');
    volControl.style.display = 'flex';
    volControl.style.alignItems = 'center';
    volControl.style.gap = '8px';

    const volSlider = document.createElement('input');
    volSlider.type = 'range';
    volSlider.className = 'volume-slider';
    volSlider.min = '0';
    volSlider.max = '100';
    volSlider.value = settings.seVolume;

    const volValue = document.createElement('span');
    volValue.style.minWidth = '32px';
    volValue.style.textAlign = 'right';
    volValue.textContent = settings.seVolume;

    volSlider.addEventListener('input', () => {
      settings.seVolume = parseInt(volSlider.value);
      volValue.textContent = settings.seVolume;
      saveSettings(settings);
    });

    volControl.appendChild(volSlider);
    volControl.appendChild(volValue);

    volRow.appendChild(volLabel);
    volRow.appendChild(volControl);
    app.appendChild(volRow);
  }

  // Kids mode toggle
  const kidsRow = document.createElement('div');
  kidsRow.className = 'option-row';
  kidsRow.style.flexDirection = 'column';
  kidsRow.style.alignItems = 'flex-start';
  kidsRow.style.gap = '8px';

  const kidsTopRow = document.createElement('div');
  kidsTopRow.style.display = 'flex';
  kidsTopRow.style.alignItems = 'center';
  kidsTopRow.style.justifyContent = 'space-between';
  kidsTopRow.style.width = '100%';

  const kidsLabel = document.createElement('label');
  kidsLabel.textContent = t('kidsMode');

  const kidsToggle = document.createElement('label');
  kidsToggle.className = 'toggle';
  const kidsInput = document.createElement('input');
  kidsInput.type = 'checkbox';
  kidsInput.checked = settings.kidsMode;
  kidsInput.addEventListener('change', () => {
    settings.kidsMode = kidsInput.checked;
    saveSettings(settings);
    setKidsMode(settings.kidsMode);
    if (onSettingsChange) onSettingsChange();
    render();
  });
  const kidsSlider = document.createElement('span');
  kidsSlider.className = 'toggle-slider';
  kidsToggle.appendChild(kidsInput);
  kidsToggle.appendChild(kidsSlider);

  kidsTopRow.appendChild(kidsLabel);
  kidsTopRow.appendChild(kidsToggle);

  const kidsDesc = document.createElement('p');
  kidsDesc.style.fontSize = '0.85rem';
  kidsDesc.style.color = '#888';
  kidsDesc.style.margin = '0';
  kidsDesc.textContent = t('kidsModeDesc');

  kidsRow.appendChild(kidsTopRow);
  kidsRow.appendChild(kidsDesc);
  app.appendChild(kidsRow);

  function render() {
    renderOptions(app, navigate, params, onSettingsChange);
  }
}
