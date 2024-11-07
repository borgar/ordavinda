/** @type {number} */
let max = parseInt(localStorage.ovhisc || '0');

export const highScore = {
  get () {
    return max;
  },

  /** @param {number} score */
  set (score) {
    max = score
    localStorage.ovhisc = max;
  }
};
