// src/services/api.js
import axios from 'axios';
import { backend_url } from '../baseUrl';

// Helper to read a specific cookie by name.
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


const api = axios.create({
  baseURL: backend_url, // Update with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        const token = getCookie('token'); // Assuming your backend stores a token cookie named 'token'
        if (token) {
          // If your API requires an Authorization header, attach it.
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - maybe log out the user or redirect to login.');
      // Optionally, remove token and/or dispatch a logout action here.
    }
    return Promise.reject(error);
  }
);

export default api;
