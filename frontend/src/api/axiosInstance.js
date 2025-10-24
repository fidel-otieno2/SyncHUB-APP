import axios from 'axios';

// Use localhost for backend
const backendURL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: backendURL,
  timeout: 10000,
});

export default axiosInstance;
