import { axiosInstance } from './config';

export const authService = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    try {
      const response = await axiosInstance.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  secondaryAuth: async (username, password) => {
    try {
      const response = await axiosInstance.post('/secondary-auth', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
