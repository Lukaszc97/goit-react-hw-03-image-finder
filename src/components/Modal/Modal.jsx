import React from 'react';

const Modal = ({ onClose, src, alt }) => (
  <div className="overlay" onClick={onClose}>
    <div className="modal">
      <img src={src} alt={alt} />
    </div>
  </div>
);

export default Modal;
