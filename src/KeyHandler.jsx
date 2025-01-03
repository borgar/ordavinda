/* global document */
import { useEffect } from 'react';

const codeToKey = {
  Space: ' ',
  Backspace: 'backspace',
  Tab: 'tab',
  Enter: 'enter',
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  ControlLeft: 'CONTROL',
  ControlRight: 'CONTROL',
  AltLeft: 'ALT',
  AltRight: 'ALT',
  CapsLock: 'capslock',
  Escape: 'escape',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  End: 'end',
  Home: 'home',
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  Delete: 'delete',
  ContextMenu: 'CONTEXTMENU',
  MetaRight: 'META', // command
  MetaLeft: 'META' // command
};

let nextAccent = null;

const accentMap = {
  '´A': 'Á',
  '´E': 'É',
  '´I': 'Í',
  '´O': 'Ó',
  '´U': 'Ú',
  '´Y': 'Ý',
  '`A': 'À',
  '`E': 'È',
  '`I': 'Ì',
  '`O': 'Ò',
  '`U': 'Ù'
};

export const KeyHandler = props => {
  const { onKey, children } = props;

  useEffect(() => {
    const keyPressHandler = e => {
      const code = e.code;
      const dead = e.key.toLowerCase() === 'dead';
      let key = null;
      if (code in codeToKey) {
        e.preventDefault();
        key = codeToKey[code];
      }
      else if (dead && (code === 'backquote' || e.keyCode === 187)) {
        // next char should have a grave accent (if possible)
        nextAccent = '`';
      }
      else if (dead && (code === 'quote' || e.keyCode === 222)) {
        // next char should have an acute accent (if possible)
        nextAccent = '´';
      }
      else {
        const char = e.key.toUpperCase();
        const accented = nextAccent + char;
        if (nextAccent && accented in accentMap) {
          key = (e.key === char)
            ? accentMap[accented]
            : accentMap[accented].toLowerCase();
        }
        else {
          key = e.key;
        }
        nextAccent = null;
      }
      if (!dead && onKey) {
        onKey({
          key: key,
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey,
          meta: e.metaKey
        });
      }
    };
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, []);

  return children || null;
};
