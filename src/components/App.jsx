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
    imageBuffer: [],
    allImagesLoaded: false,
    currentIndex: 0,
  };

  handleSubmit = query => {
    this.setState(
      { query, images: [], page: 1, allImagesLoaded: false },
      this.fetchImages
    );
  };

  fetchImages = () => {
    const { query, page, images, imageBuffer, allImagesLoaded } = this.state;

    if (allImagesLoaded) {
      return;
    }

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

        if (newImages.length === 0) {
          this.setState({ allImagesLoaded: true });
          return;
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          page: prevState.page + 1,
        }));

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

  openModal = src => {
    const { images } = this.state;
    const currentIndex = images.findIndex(image => image.largeImageURL === src);
    this.setState({ showModal: true, currentIndex });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  handleNext = () => {
    const { currentIndex, imageBuffer } = this.state;
    const lastIndex = imageBuffer.length - 1;
    let nextIndex = currentIndex + 1;
    if (nextIndex > lastIndex) {
      nextIndex = 0;
    }
    this.setState({ currentIndex: nextIndex });
  };

  handlePrev = () => {
    const { currentIndex, imageBuffer } = this.state;
    const lastIndex = imageBuffer.length - 1;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = lastIndex;
    }
    this.setState({ currentIndex: prevIndex });
  };

  render() {
    const { images, isLoading, showModal, currentIndex } = this.state;

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
        {images.length > 0 && !isLoading && !this.state.allImagesLoaded && (
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
