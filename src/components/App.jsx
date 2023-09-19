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
  };

  // Funkcja do obsługi formularza wyszukiwania
  handleSubmit = query => {
    this.setState({ query, images: [], page: 1 }, this.fetchImages);
  };

  // Funkcja do ładowania obrazków z API
  fetchImages = () => {
    const { query, page } = this.state;
    const URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    this.setState({ isLoading: true });

    axios
      .get(URL)
      .then(response => {
        this.setState(prevState => ({
          images: [...prevState.images, ...response.data.hits],
          page: prevState.page + 1,
        }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  // Funkcja do otwierania modala z dużą wersją obrazka
  openModal = src => {
    this.setState({ showModal: true, modalImage: src });
  };

  // Funkcja do zamykania modala
  closeModal = () => {
    this.setState({ showModal: false, modalImage: '' });
  };

  render() {
    const { images, isLoading, showModal, modalImage } = this.state;

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
          <Modal src={modalImage} alt="Large Image" onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

export default App;
