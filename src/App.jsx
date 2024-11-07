import React, { useState } from 'react';
import { Header } from './Header.jsx';
import { Game } from './Game.jsx';
import { AttractMode } from './AttractMode.jsx';
import css from './App.css';

export function App () {
  const [ playing, setPlaying ] = useState(false);

  return (
    <div className='game'>
      <Header />
      {playing
        ? <Game onExit={() => setPlaying(false)} />
        : <AttractMode onPlay={() => setPlaying(true)} />
      }
    </div>
  );
}
