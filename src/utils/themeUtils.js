// Theme configuration
export const themeConfig = {
  light: {
    background: {
      primary: 'white',
      secondary: '#f4f4f6',
      accent: '#e6e9f0'
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#4a5568'
    },
    border: {
      primary: 'rgba(0, 0, 0, 0.1)',
      secondary: 'rgba(0, 0, 0, 0.05)'
    }
  },
  dark: {
    background: {
      primary: '#1a202c',
      secondary: '#2d3748',
      accent: '#4a5568'
    },
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e0',
      accent: '#a0aec0'
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)'
    }
  }
};

// Helper functions for theme management
export const getThemeValue = (theme, path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], themeConfig[theme]);
};

export const isDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// CSS custom properties generator
export const generateThemeVariables = (theme) => {
  const variables = {};
  
  Object.entries(themeConfig[theme]).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      variables[`--${category}-${key}`] = value;
    });
  });
  
  return variables;
};

// Theme transition helper
export const getTransitionStyles = () => ({
  transition: `
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease
  `
});
