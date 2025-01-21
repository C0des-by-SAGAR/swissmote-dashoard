import { axiosInstance } from '../config/axiosConfig';

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error);
  }
); 