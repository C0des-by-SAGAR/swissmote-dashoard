import React, { useEffect, useState } from 'react';

// Breakpoints matching the screenshot requirements
const breakpoints = {
  small: 30, // 480px
  medium: 60, // 960px
  large: 80  // 1280px
};

const ResponsiveWrapper = ({ 
  children,
  renderMobile,
  renderTablet,
  renderDesktop 
}) => {
  const [screenSize, setScreenSize] = useState(getScreenSize());

  function getScreenSize() {
    const width = window.innerWidth;
    const em = width / 16; // Convert px to em

    if (em < breakpoints.small) return 'mobile';
    if (em < breakpoints.medium) return 'tablet';
    return 'desktop';
  }

  useEffect(() => {
    const handleResize = () => {
      const newSize = getScreenSize();
      if (newSize !== screenSize) {
        setScreenSize(newSize);
      }
    };

    // Debounced resize listener
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [screenSize]);

  // Render appropriate content based on screen size
  const renderContent = () => {
    switch (screenSize) {
      case 'mobile':
        return renderMobile ? renderMobile() : children;
      case 'tablet':
        return renderTablet ? renderTablet() : children;
      case 'desktop':
        return renderDesktop ? renderDesktop() : children;
      default:
        return children;
    }
  };

  return (
    <div className={`responsive-wrapper screen-${screenSize}`}>
      {renderContent()}
    </div>
  );
};

// Export breakpoints for use in other components
export const useBreakpoints = () => breakpoints;
export default ResponsiveWrapper;
