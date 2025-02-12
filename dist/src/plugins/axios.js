import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3500/api',   
/*         baseURL: 'https://inventario-xha6.onrender.com/api',      */
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-token'] = token;
    console.log('Token agregado a la solicitud:', token);  
  }
  return config;
}, (error) => {
  console.error('Error en la solicitud:', error);
  return Promise.reject(error);
});

export default apiClient;
