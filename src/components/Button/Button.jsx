import React from 'react';
import styles from './Button.module.css';

const Button = ({ onClick, disabled }) => (
  <div className={styles.buttonContainer}>
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.buttonLabel}>Load more</span>
    </button>
  </div>
);

export default Button;
