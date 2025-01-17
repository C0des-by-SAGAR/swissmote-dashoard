import React from 'react';

const SidebarItem = ({ icon, label, isActive, onClick }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  return (
    <li 
      className={`
        flex items-center pa3 pointer transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-blue white' 
          : 'hover-bg-black-10 dark:hover-bg-gray-700 dark:text-gray-300'
        }
      `}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      <span className="mr3 f4">{icon}</span>
      <span className="f6 fw5">{label}</span>
    </li>
  );
};

export default SidebarItem;
