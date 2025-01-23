import React, { useState, useRef, useEffect } from 'react';
import { FiLogOut, FiBriefcase, FiFileText, FiChevronLeft, FiChevronRight, FiChevronDown, FiMessageCircle, FiMessageSquare } from 'react-icons/fi';
import { MdWork, MdSchool, MdVolunteerActivism, MdAutorenew, MdCheckCircle, MdCancel } from 'react-icons/md';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ isExpanded, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path.includes('/assignments')) return 'assignments';
    if (path.includes('/job-listings')) return 'jobListings';
    return 'dashboard';
  });
  const [isPostJobsOpen, setIsPostJobsOpen] = useState(false);
  const [isJobListingsOpen, setIsJobListingsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isExpanded) {
          onToggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onToggle]);

  const postJobsSubmenu = [
    {
      id: 'fullTimeJobs',
      label: 'Post Jobs',
      icon: <MdWork />,
      path: '/post-jobs'
    },
    {
      id: 'internship',
      label: 'Post Internship',
      icon: <MdSchool />,
      path: '/post-internship'
    },
    {
      id: 'unpaidInternship',
      label: 'Post Unpaid Internship',
      icon: <MdVolunteerActivism />,
      path: '/post-unpaid-internship'
    }
  ];

  const jobListingsSubmenu = [
    {
      id: 'autoListings',
      label: 'Auto Listings',
      icon: <MdAutorenew />,
      path: '/auto-listings'
    },
    {
      id: 'activeListings',
      label: 'Active Listings',
      icon: <MdCheckCircle />,
      path: '/active-listings'
    },
    {
      id: 'closedListings',
      label: 'Closed Listings',
      icon: <MdCancel />,
      path: '/closed-listings'
    }
  ];

  const menuItems = [
    {
      id: 'postJobs',
      label: 'Jobs & Internships',
      icon: <FiBriefcase />,
      hasDropdown: true
    },
    {
      id: 'jobListings',
      label: 'Job & Internship Listings',
      icon: <FiFileText />,
      hasDropdown: true
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: <FiFileText />,
      path: '/assignments'
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: <FiMessageCircle />,
      path: '/questions'
    }
  ];

  const handleToggleClick = (e) => {
    e.stopPropagation();
    onToggle();
  };

  const handleItemClick = (e, itemId, path, hasDropdown) => {
    e.stopPropagation();
    setActiveItem(itemId);
    
    if (hasDropdown) {
      if (!isExpanded) {
        onToggle();
      }
      
      if (itemId === 'postJobs') {
        setIsPostJobsOpen(true);
        setIsJobListingsOpen(false);
      } else if (itemId === 'jobListings') {
        setIsJobListingsOpen(true);
        setIsPostJobsOpen(false);
      }
    } else if (path) {
      navigate(path);
    }
  };

  const renderMenuItem = (item) => {
    const isDropdown = item.hasDropdown && isExpanded;
    
    return (
      <div 
        key={item.id}
        className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
        onClick={(e) => handleItemClick(e, item.id, item.path, isDropdown)}
        role="button"
        tabIndex={0}
      >
        <div className="item-content">
          <span className="item-icon">{item.icon}</span>
          <span className="item-label">
            {item.label}
          </span>
        </div>
        {isDropdown && (
          <FiChevronDown 
            className={`dropdown-icon ${
              (item.id === 'postJobs' && isPostJobsOpen) ||
              (item.id === 'jobListings' && isJobListingsOpen)
                ? 'rotated'
                : ''
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <aside 
      ref={sidebarRef} 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div 
          className="flex items-center pointer hover-bg-black-10" 
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
        >
          <span className="brand-icon">SM</span>
          {isExpanded && <span className="brand-text ml2">Swissmote</span>}
        </div>
        <button 
          className="toggle-button"
          onClick={handleToggleClick}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            {renderMenuItem(item)}
            {isExpanded && item.id === 'postJobs' && isPostJobsOpen && (
              <div className="submenu">
                {postJobsSubmenu.map((subItem) => renderMenuItem(subItem))}
              </div>
            )}
            {isExpanded && item.id === 'jobListings' && isJobListingsOpen && (
              <div className="submenu">
                {jobListingsSubmenu.map((subItem) => renderMenuItem(subItem))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Footer/Logout */}
      <div className="sidebar-footer">
        <div 
          className="logout-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/feedback');
          }}
          role="button"
          tabIndex={0}
        >
          <FiMessageSquare />
          <span>Feedback</span>
        </div>
        <div 
          className="logout-button"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Logout clicked');
          }}
          role="button"
          tabIndex={0}
        >
          <FiLogOut />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Sidebar;
