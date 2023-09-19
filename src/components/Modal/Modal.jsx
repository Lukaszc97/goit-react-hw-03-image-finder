// Modal.js

import React, { useEffect } from 'react';
import styles from './Modal.module.css'; // Zaimportuj arkusz stylów

const Modal = ({ onClose, src, alt, onNext, onPrev, currentIndex }) => {
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleArrowKeys = event => {
      if (event.key === 'ArrowLeft') {
        onPrev();
      } else if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [onClose, onNext, onPrev]);


  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {

      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className={`${styles.overlay} ${styles.active}`} onClick={onClose}>
      <div className={styles.modal}>
        {src.length > 0 && <img src={src[currentIndex]} alt={alt} />}
     
      </div>
    </div>
  );
};

export default Modal;
