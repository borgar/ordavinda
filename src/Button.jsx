import React from 'react';
import classNames from 'classnames';
import css from './Button.css';

/**
 * @param {object} prop
 * @param {React.MouseEventHandler<HTMLButtonElement>} [prop.onClick]
 * @param {string} [prop.className]
 * @param {boolean} [prop.disabled]
 * @param {React.ReactNode} [prop.children]
 */
export function Button ({ onClick, className, children, disabled }) {
  return (
    <button
      type="button"
      className={classNames(className, 'btn')}
      onClick={onClick}
      disabled={disabled}
      >
      {children}
    </button>
  );
}
