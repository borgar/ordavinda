import React from 'react';
import css from './Icon.css';

/**
 * @param {object} opts
 * @param {string} opts.name
 * @param {number} [opts.size]
 * @return {React.ReactElement}
 */
export default function Icon ({ name, size }) {
  if (name === 'vinda') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={(size || 24) + 'px'}
        width={(size || 24) + 'px'}
        viewBox="0 -960 960 960"
        fill="black">
        <path
          fill="black"
          d={"M418 -893 L418 -815 C287 -791 181 -692 149 -564 L186 -601 L230 -557 C257 -644 328 -712 418 -734 L418 -654 L537 -773 L418 -893z" +
             "M563 -810 L601 -773 L557 -729 C644 -703 712 -631 734 -541 L654 -541 L773 -422 L893 -541 L815 -541 C791 -672 692 -778 563 -810z" +
             "M186 -537 L66 -418 L144 -418 C168 -287 267 -181 396 -149 L358 -186 L402 -230 C315 -256 247 -328 225 -418 L305 -418 L186 -537z" +
             "M729 -402 C703 -315 631 -247 541 -225 L541 -305 L422 -186 L541 -66 L541 -144 C672 -168 778 -267 810 -396 L773 -358 L729 -402z"}
        />
      </svg>
    );
  }
  return (
    <span
      className="material-icons-sharp"
      style={{ fontSize: size ? size + 'px' : null }}
      >
      {name}
    </span>
  );
}
