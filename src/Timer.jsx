import React, { useEffect, useState } from 'react';
import { Clock } from './utils/Clock';
// import css from './Timer.css';

/**
 * @param {object} props
 * @param {Clock} props.clock
 * @param {number} props.duration
 * @return {React.ReactElement}
 */
export function Timer ({ clock, duration }) {
  const [ t, setT ] = useState(0);

  useEffect(() => {
    const onTick = sec => setT(sec);
    clock.on('tick', onTick);
    return () => { clock.off('tick', onTick); };
  }, [ setT ]);

  const r = Math.max(0, duration - t);
  const s = Math.floor(r % 60);
  const m = Math.floor(r / 60);
  return (
    <div id="time">
      <span>Tími:</span> {}
      <span>{m}:{String(s).padStart(2, '0')}</span>
    </div>
  );
}
