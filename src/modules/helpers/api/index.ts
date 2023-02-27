import axios from 'axios';

const api = axios.create({
  headers: {
    origin: 'http://api.iodash.anazirov.com',
  },
});

export default api;
