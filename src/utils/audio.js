const sounds = {};

export function loadSound (id, url, vol = 1) {
  if (sounds[id]) { return; }
  const a = document.createElement('audio');
  a.id = id;
  a.src = url;
  a.volume = vol;
  a.preload = 'auto';
  sounds[id] = a;
}

export function playSound (id) {
  if (localStorage.ovsnd !== 'off' && sounds[id]) {
    sounds[id].play();
  }
}
