import axios from 'axios';

const api = axios.create({
  headers: {
    origin: 'https://api.sunnyart.uz',
  },
});

export default api;
