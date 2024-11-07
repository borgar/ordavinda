/**
 * @param {HTMLElement | null} element
 * @param {string} className
 * @param {number} [delay]
 */
export function animateWithClass (element, className, delay=0) {
  if (!element) { return }
  // XXX: deal with repeat calls while animation is still playinh
  const callfunction = () => {
    element.classList.remove(className);
    element.removeEventListener('animationend', callfunction);
  };
  if (delay != null) {
    element.style.animationDelay = delay + 'ms';
  }
  element.addEventListener('animationend', callfunction);
  element.classList.add(className);
}
