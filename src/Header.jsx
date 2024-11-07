import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import css from './Header.css';

function detectDarkDefault () {
  if (localStorage.ovmde === 'dark') {
    return true;
  }
  else if (localStorage.ovmde === 'light') {
    return false;
  }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  return false;
}

export function Header () {
  const [ audioOn, setAudioOn ] = useState(localStorage.ovsnd !== 'off');
  const [ darkMode, setDarkMode ] = useState(detectDarkDefault());

  useEffect(() => {
    document.body.classList.toggle('darkMode', darkMode);
  }, [ darkMode ]);

  return (
    <div className='header'>
      <h1>Orðavinda</h1>
      <div className='buttons'>

        <button
          type="button"
          onClick={() => {
            if (audioOn) {
              localStorage.ovsnd = 'off';
              setAudioOn(false);
            }
            else {
              localStorage.ovsnd = 'on';
              setAudioOn(true);
            }
          }}
          >
          <Icon size={28} name={audioOn ? 'volume_up' : 'volume_off'} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (darkMode) {
              localStorage.ovmde = 'light';
              setDarkMode(false);
            }
            else {
              localStorage.ovmde = 'dark';
              setDarkMode(true);
            }
          }}
          >
          <Icon size={28} name={darkMode ? "light_mode" : "dark_mode"} />
        </button>
      </div>
    </div>
  );
}
