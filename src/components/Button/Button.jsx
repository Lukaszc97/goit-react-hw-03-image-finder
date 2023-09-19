import React from 'react';

const Button = ({ onClick, disabled }) => (
  <button
    type="button"
    className="button"
    onClick={onClick}
    disabled={disabled}
  >
    <span className="button-label">Load more</span>
  </button>
);

export default Button;
