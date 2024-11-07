import React from 'react';
import Icon from './Icon.jsx';
import css from './WordList.css';
import classNames from 'classnames';

const BIN_URL = 'https://bin.arnastofnun.is/leit/beygingarmynd/';

/**
 * @param {object} props
 * @param {string[]} props.words
 * @param {string[]} props.found
 * @param {boolean} [props.expose]
 * @param {string} [props.className]
 * @return {React.ReactElement}
 */
export function WordList ({ className, words, found, expose }) {
  return (
    <>
      {words.map(word => {
        const isFound = found.includes(word);
        const visible = (isFound || expose);
        const cls = 'word ' + ('ws' + word.length);
        const chars = word.split('').map((c, i) => (
          <span className='char' key={i}>
            {visible ? c.toUpperCase() : '?'}
          </span>
        ));
        return (
          <div
            className={classNames(cls, isFound && 'found', expose && 'exposed')}
            key={word}
            >
            {visible
              ? <a href={BIN_URL + word} target="_blank" className='wd'>{chars}</a>
              : <span className='wd'>{chars}</span>}
          </div>
        );
      })}
    </>
  );
}
