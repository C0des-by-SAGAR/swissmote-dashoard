import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSidebarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="layout-container">
      <Sidebar isExpanded={isExpanded} onToggle={handleSidebarToggle} />
      <div className={`main-content ${isExpanded ? 'content-expanded' : 'content-collapsed'}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
