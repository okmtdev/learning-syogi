// Audio manager for sound effects
import { loadSettings } from './storage.js';

const sounds = {
  koma: null,
  hakusyu: null,
  hatodokei: null,
};

let loaded = false;

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  sounds.koma = new Audio('koma.mp3');
  sounds.hakusyu = new Audio('hakusyu.mp3');
  sounds.hatodokei = new Audio('hatodokei.mp3');
}

function play(name) {
  const settings = loadSettings();
  if (!settings.seEnabled) return;

  ensureLoaded();
  const audio = sounds[name];
  if (!audio) return;

  audio.volume = settings.seVolume / 100;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export function playKoma() {
  play('koma');
}

export function playHakusyu() {
  play('hakusyu');
}

export function playHatodokei() {
  play('hatodokei');
}
