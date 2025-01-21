export const handleApiError = (error) => {
  // Log the full error for debugging
  console.error('API Error Details:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    config: error.config
  });

  // Check for offline status first
  if (!navigator.onLine) {
    return {
      error: true,
      message: 'No internet connection. Please check your network.'
    };
  }

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    switch (status) {
      case 400:
        return {
          error: true,
          message: 'Invalid request. Please check your input.',
          details: error.response.data?.details
        };
      case 401:
        // Clear token if unauthorized
        localStorage.removeItem('access_token');
        return {
          error: true,
          message: 'Invalid credentials. Please sign in again.'
        };
      case 403:
        return {
          error: true,
          message: 'Access denied. Please check your permissions.'
        };
      case 404:
        return {
          error: true,
          message: 'Resource not found. Please try again later.'
        };
      case 422:
        return {
          error: true,
          message: 'Validation Error',
          details: error.response.data?.details || []
        };
      case 429:
        return {
          error: true,
          message: 'Too many attempts. Please try again later.'
        };
      case 500:
        return {
          error: true,
          message: 'Server error. Please try again later.'
        };
      default:
        return {
          error: true,
          message: message
        };
    }
  }

  if (error.request) {
    // Request was made but no response received
    return {
      error: true,
      message: 'No response from server. Please check your connection.'
    };
  }

  // Something happened in setting up the request
  return {
    error: true,
    message: error.message || 'An unexpected error occurred. Please try again.'
  };
}; 