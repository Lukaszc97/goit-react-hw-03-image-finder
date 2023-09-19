// App.js

import React, { Component } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const API_KEY = '38011218-cb164cf0dde7e2df63faecdfa';

class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    showModal: false,
    modalImage: '',
    imageBuffer: [], // Bufor zdjęć
    currentIndex: 0,
  };

  // Funkcja do obsługi formularza wyszukiwania
  handleSubmit = query => {
    this.setState({ query, images: [], page: 1 }, this.fetchImages);
  };

  // Funkcja do ładowania obrazków z API
  fetchImages = () => {
    const { query, page, images, imageBuffer } = this.state;
    const URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    this.setState({ isLoading: true });

    axios
      .get(URL)
      .then(response => {
        const newImages = response.data.hits.filter(
          image =>
            !images.includes(image) &&
            !imageBuffer.includes(image.largeImageURL)
        );

        this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          page: prevState.page + 1,
        }));

        // Dodaj nowe obrazy do bufora
        this.setState(prevState => ({
          imageBuffer: [
            ...prevState.imageBuffer,
            ...newImages.map(image => image.largeImageURL),
          ],
        }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  // Funkcja do otwierania modala z dużą wersją obrazka
  openModal = src => {
    const { imageBuffer, images } = this.state;
    const currentIndex = images.findIndex(image => image.largeImageURL === src);
    this.setState({ showModal: true, modalImage: src, currentIndex });

    // Jeśli obraz nie jest w buforze, załaduj go
    if (!imageBuffer.includes(src)) {
      this.setState(prevState => ({
        imageBuffer: [...prevState.imageBuffer, src],
      }));
    }
  };

  // Funkcja do zamykania modala
  closeModal = () => {
    this.setState({ showModal: false, modalImage: '' });
  };

  // Funkcja do przewijania zdjęć w modalu
  handleNext = () => {
    const { currentIndex, imageBuffer } = this.state;
    if (currentIndex < imageBuffer.length - 1) {
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex + 1,
      }));
    }
  };

  handlePrev = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex - 1,
      }));
    }
  };

  render() {
    const { images, isLoading, showModal, modalImage, currentIndex } =
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
        {images.length > 0 && !isLoading && (
          <Button onClick={this.fetchImages} disabled={isLoading} />
        )}
        {showModal && (
          <Modal
            src={images.map(image => image.largeImageURL)}
            alt="Large Image"
            onClose={this.closeModal}
            onNext={this.handleNext}
            onPrev={this.handlePrev}
            currentIndex={currentIndex}
          />
        )}
      </div>
    );
  }
}

export default App;
