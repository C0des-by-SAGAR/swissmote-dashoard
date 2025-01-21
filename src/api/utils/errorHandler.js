export const handleApiError = (error) => {
  // Log the full error for debugging
  console.error('API Error Details:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    config: error.config // This will show the request details
  });

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        return {
          error: true,
          message: 'Unauthorized access'
        };
      case 403:
        return {
          error: true,
          message: 'Access forbidden'
        };
      case 404:
        return {
          error: true,
          message: 'Resource not found'
        };
      case 422:
        return {
          error: true,
          message: 'Validation Error',
          details: error.response.data?.detail || []
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

  // Something else happened while setting up the request
  return {
    error: true,
    message: 'Failed to make request'
  };
}; 