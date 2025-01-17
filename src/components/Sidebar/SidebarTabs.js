import React from 'react';

const SidebarTabs = ({ activeTab, onTabChange, tabs }) => {
  const handleKeyPress = (e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onTabChange(tabId);
    }
  };

  return (
    <div className="flex bb b--black-10 dark:b--gray-700" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            bn bg-transparent pa3 pointer flex-auto transition-colors duration-200
            ${activeTab === tab.id 
              ? 'blue bb b--blue bw2' 
              : 'black-60 dark:text-gray-400 hover-black dark:hover-white'
            }
          `}
          onClick={() => onTabChange(tab.id)}
          onKeyPress={(e) => handleKeyPress(e, tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          tabIndex={0}
        >
          <span className="f6 fw5">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SidebarTabs;
