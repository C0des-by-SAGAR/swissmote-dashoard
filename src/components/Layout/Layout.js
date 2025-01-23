import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSidebarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="layout-container">
      <Sidebar 
        isExpanded={isExpanded} 
        onToggle={handleSidebarToggle}
      />
      <main className={`main-content ${isExpanded ? 'content-expanded' : 'content-collapsed'}`}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
