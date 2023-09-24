import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from './api';

class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    showModal: false,
    modalImageSrc: '',
    allImagesLoaded: false,
  };

  handleSubmit = query => {
    this.setState(
      { query, images: [], page: 1, allImagesLoaded: false },
      this.fetchImages
    );
  };

  fetchImages = () => {
    const { query, page, images, allImagesLoaded } = this.state;

    if (allImagesLoaded) {
      return;
    }

    fetchImages(query, page)
      .then(data => {
        const newImages = data.hits.filter(image => !images.includes(image));

        if (newImages.length === 0) {
          this.setState({ allImagesLoaded: true });
          return;
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          page: prevState.page + 1,
        }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  openModal = src => {
    this.setState({ showModal: true, modalImageSrc: src });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { images, isLoading, showModal, modalImageSrc, allImagesLoaded } =
      this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery>
          {images.map(image => (
            <ImageGalleryItem
              key={image.id}
              src={image.webformatURL}
              alt={image.tags}
              onClick={() => this.openModal(image.largeImageURL)}
            />
          ))}
        </ImageGallery>
        {isLoading && <Loader />}
        {images.length > 0 && !isLoading && !allImagesLoaded && (
          <Button onClick={this.fetchImages} disabled={isLoading} />
        )}

        {allImagesLoaded ? (
          <p style={{ textAlign: 'center' }}>All images loaded.</p>
        ) : (
          isLoading && <Loader />
        )}

        {showModal && (
          <Modal
            src={modalImageSrc}
            alt="Large Image"
            onClose={this.closeModal}
          />
        )}
      </div>
    );
  }
}

export default App;
