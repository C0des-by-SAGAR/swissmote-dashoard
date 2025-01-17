// Screen breakpoints in em units
export const breakpoints = {
  small: 30,   // 480px
  medium: 60,  // 960px
  large: 80    // 1280px
};

// Media query strings for use with CSS-in-JS or styled-components
export const mediaQueries = {
  smallOnly: `@media screen and (max-width: ${breakpoints.small}em)`,
  mediumUp: `@media screen and (min-width: ${breakpoints.small}em)`,
  mediumOnly: `@media screen and (min-width: ${breakpoints.small}em) and (max-width: ${breakpoints.medium}em)`,
  largeUp: `@media screen and (min-width: ${breakpoints.medium}em)`,
};

// Utility function to check current breakpoint
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'large'; // SSR fallback
  
  const em = window.innerWidth / 16;
  if (em < breakpoints.small) return 'small';
  if (em < breakpoints.medium) return 'medium';
  return 'large';
};

// Hook for responsive values
export const getResponsiveValue = (values) => {
  const breakpoint = getCurrentBreakpoint();
  return values[breakpoint] || values.default;
};
