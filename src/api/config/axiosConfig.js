import axios from 'axios';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://api.swissmote.com';

// Add this if authentication is required
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token'); // or however you store your auth token
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true, // Enable sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'https://swissmote-dashoard.vercel.app',
    ...getAuthHeaders()
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL
      });
    }

    // Add CORS headers
    config.headers['Origin'] = 'https://swissmote-dashoard.vercel.app';
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
); 