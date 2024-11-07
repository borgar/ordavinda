import React from 'react';
import { highScore } from './utils/highScore.js';
import css from './Score.css';

export function Score ({ score }) {
  let hi = highScore.get();
  if (score > hi) {
    hi = score;
    highScore.set(hi);
  }
  return (
    <div id="score">
      <span>Stig:</span> {}
      <strong>{score}</strong> {}
      {!!hi && (
        <small
          className="highscore"
          title="Hæst komist"
          >
          {hi}
        </small>
      )}
    </div>
  );
}
