/** @type {string[]} */
let hist = JSON.parse(localStorage.ovhist || '[]');

export const levelHistory = {
  /** @param {string} key */
  has (key) {
    return hist.includes(key);
  },

  /** @param {string} key */
  add (key) {
    hist = [ ...hist.slice(-50), key ];
    localStorage.ovhist = JSON.stringify(hist);
  }
};
