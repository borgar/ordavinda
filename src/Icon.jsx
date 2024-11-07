import React from 'react';
import css from './Icon.css';

/**
 * @param {object} opts
 * @param {string} opts.name
 * @param {number} [opts.size]
 * @return {React.ReactElement}
 */
export default function Icon ({ name, size }) {
  return (
    <span
      className="material-icons-sharp"
      style={{ fontSize: size ? size + 'px' : null }}
      >
      {name}
    </span>
  );
}
