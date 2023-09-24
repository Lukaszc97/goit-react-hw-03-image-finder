import axios from 'axios';

const API_KEY = '38011218-cb164cf0dde7e2df63faecdfa';

const fetchImages = (query, page, perPage = 12) => {
  const URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

  return axios
    .get(URL)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export { fetchImages };
