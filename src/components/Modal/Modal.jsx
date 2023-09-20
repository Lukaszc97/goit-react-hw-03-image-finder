import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, src, alt }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className={`${styles.overlay} ${styles.active}`} onClick={onClose}>
      <div className={styles.modal}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

export default Modal;
