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
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network Error:', error);
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    }
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
); 