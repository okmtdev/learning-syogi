// LocalStorage manager for settings and progress
const STORAGE_KEY = 'syogi_renshu';

const defaultSettings = {
  seEnabled: true,
  seVolume: 50,
  kidsMode: false,
  clearedPuzzles: [],
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (_) { /* ignore */ }
  return { ...defaultSettings };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (_) { /* ignore */ }
}

export function markPuzzleCleared(puzzleId) {
  const s = loadSettings();
  if (!s.clearedPuzzles.includes(puzzleId)) {
    s.clearedPuzzles.push(puzzleId);
    saveSettings(s);
  }
}

export function isPuzzleCleared(puzzleId) {
  return loadSettings().clearedPuzzles.includes(puzzleId);
}
