import React, { useState } from 'react';
import { FiLogOut, FiBriefcase, FiFileText, FiHelpCircle, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { MdWork, MdSchool, MdVolunteerActivism, MdAutorenew, MdCheckCircle, MdCancel } from 'react-icons/md';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isExpanded, onToggle }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isPostJobsOpen, setIsPostJobsOpen] = useState(false);
  const [isJobListingsOpen, setIsJobListingsOpen] = useState(false);

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
      hasDropdown: true,
      submenu: [
        {
          id: 'automatedListings',
          label: 'Automated Listings',
          path: '/automated-listings'
        },
        {
          id: 'notAutomatedListings',
          label: 'Not Automated Listings',
          path: '/not-automated-listings'
        },
        {
          id: 'expiredListings',
          label: 'Expired Listings',
          path: '/expired-listings'
        }
      ]
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
      icon: <FiBriefcase />
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
      icon: <FiFileText />
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: <FiHelpCircle />
    }
  ];

  const handlePostJobsClick = (e) => {
    e.stopPropagation();
    if (!isExpanded) {
      onToggle();
    }
    setIsPostJobsOpen(!isPostJobsOpen);
  };

  const handleJobListingsClick = (e) => {
    e.stopPropagation();
    if (!isExpanded) {
      onToggle();
    }
    setIsJobListingsOpen(!isJobListingsOpen);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onToggle(); // Always collapse sidebar after selection
  };

  const handleSubmenuItemClick = (itemId, path) => {
    setActiveItem(itemId);
    if (path) {
      navigate(path);
    }
    onToggle(); // Collapse sidebar after selection
    setIsPostJobsOpen(false);
    setIsJobListingsOpen(false);
  };

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div 
          className="flex items-center pointer hover-bg-black-10" 
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/');
            }
          }}
          style={{ outline: 'none' }}
        >
          <span className="brand-icon">SM</span>
          {isExpanded && <span className="brand-text ml2">Swissmote</span>}
        </div>
        <button 
          className="toggle-button"
          onClick={onToggle}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {/* Jobs & Internships Dropdown */}
        <div 
          className={`nav-item ${activeItem === 'postJobs' ? 'active' : ''} ${!isExpanded ? 'collapsed-item' : 'expanded-item'}`}
          onClick={handlePostJobsClick}
        >
          <span className="item-icon"><FiBriefcase /></span>
          <span className={`item-label ${!isExpanded ? 'collapsed-label' : ''}`}>
            Jobs & Internships
          </span>
          {isExpanded && (
            <FiChevronDown className={`dropdown-icon ${isPostJobsOpen ? 'rotated' : ''}`} />
          )}
        </div>

        {/* Jobs & Internships Submenu */}
        {isExpanded && isPostJobsOpen && (
          <div className="submenu">
            {postJobsSubmenu.map((item) => (
              <div 
                key={item.id}
                className={`nav-item submenu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleSubmenuItemClick(item.id, item.path)}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Job Listings Dropdown */}
        <div 
          className={`nav-item ${activeItem === 'jobListings' ? 'active' : ''} ${!isExpanded ? 'collapsed-item' : 'expanded-item'}`}
          onClick={handleJobListingsClick}
        >
          <span className="item-icon"><FiFileText /></span>
          <span className={`item-label ${!isExpanded ? 'collapsed-label' : ''}`}>
            Job & Internship Listings
          </span>
          {isExpanded && (
            <FiChevronDown className={`dropdown-icon ${isJobListingsOpen ? 'rotated' : ''}`} />
          )}
        </div>

        {/* Job Listings Submenu */}
        {isExpanded && isJobListingsOpen && (
          <div className="submenu">
            {/* Auto Listings with its nested submenu */}
            <div>
              <div 
                className={`nav-item submenu-item ${activeItem === 'autoListings' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === 'autoListings' ? '' : 'autoListings');
                }}
              >
                <span className="item-icon"><MdAutorenew /></span>
                <span className="item-label">Auto Listings</span>
                <FiChevronDown className={`dropdown-icon ${activeItem === 'autoListings' ? 'rotated' : ''}`} />
              </div>
              
              {/* Nested submenu for Auto Listings */}
              {activeItem === 'autoListings' && (
                <div className="nested-submenu">
                  {jobListingsSubmenu[0].submenu.map((subItem) => (
                    <div 
                      key={subItem.id}
                      className={`nested-submenu-item ${activeItem === subItem.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmenuItemClick(subItem.id, subItem.path);
                      }}
                    >
                      <span className="item-label">{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Job Listings menu items */}
            {jobListingsSubmenu.slice(1).map((item) => (
              <div 
                key={item.id}
                className={`nav-item submenu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmenuItemClick(item.id, item.path);
                }}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Render remaining menu items */}
        {menuItems.slice(2).map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''} ${!isExpanded ? 'collapsed-item' : 'expanded-item'}`}
            onClick={() => handleItemClick(item.id)}
          >
            <span className="item-icon">{item.icon}</span>
            <span className={`item-label ${!isExpanded ? 'collapsed-label' : ''}`}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Footer/Logout */}
      <div className="sidebar-footer">
        <div 
          className={`logout-button ${!isExpanded ? 'collapsed-item' : ''}`}
          onClick={() => {
            console.log('Logout clicked');
            onToggle(); // Collapse sidebar on logout
          }}
        >
          <FiLogOut />
          <span className={`${!isExpanded ? 'collapsed-label' : ''}`}>
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
