import React from 'react';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ src, alt, onClick }) => (
  <li className={styles.galleryItem} onClick={onClick}>
    <img src={src} alt={alt} />
  </li>
);

export default ImageGalleryItem;
