import React from 'react';
import Icon from './Icon.jsx';
import css from './Tile.css';

/**
 * @typedef TileData
 * @prop {string} id
 * @prop {string} char
 * @prop {number} rot
 * @prop {number} place
 * @prop {boolean} active
 */

/**
 * @param {object} props
 * @param {TileData} props.data
 * @param {Function} [props.onClick]
 * @return {React.ReactElement}
 */
export function Tile ({ data, onClick }) {
  return (
    <button
      type="button"
      className="letter"
      id={data.id}
      data-place={data.place}
      style={{ '--rot' : data.rot + 'deg' }}
      disabled={!!data.active}
      onClick={() => onClick(data)}
    >
      {data.char}
    </button>
  );
}
