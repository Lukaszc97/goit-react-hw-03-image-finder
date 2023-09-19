import React from 'react';
import styles from './ImageGallery.module.css';

const ImageGallery = ({ children }) => (
  <ul className={styles.gallery}>{children}</ul>
);

export default ImageGallery;
