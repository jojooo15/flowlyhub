import React, { useState } from 'react';
import '../styles/MobileNav.css';

const MobileNav = ({ isOpen, onClose, navigationItems, currentPath }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (itemName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleItemClick = (item) => {
    if (item.submenu) {
      toggleSubmenu(item.name);
    } else {
      onClose();
      // Navigate to the route
      window.location.href = item.path;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isOpen ? 'mobile-nav-open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <img src="/flowlyhub-logo.png" alt="FlowlyHub" />
            <span>FlowlyHub</span>
          </div>
          <button 
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {navigationItems.map((item) => (
              <li key={item.name} className="mobile-nav-item">
                <button
                  className={`mobile-nav-link ${
                    currentPath === item.path ? 'active' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                  {item.submenu && (
                    <span className={`nav-arrow ${
                      expandedMenus[item.name] ? 'nav-arrow-up' : ''
                    }`}>
                      ▼
                    </span>
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && (
                  <ul className={`mobile-submenu ${
                    expandedMenus[item.name] ? 'mobile-submenu-open' : ''
                  }`}>
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name} className="mobile-submenu-item">
                        <button
                          className={`mobile-submenu-link ${
                            currentPath === subItem.path ? 'active' : ''
                          }`}
                          onClick={() => {
                            onClose();
                            window.location.href = subItem.path;
                          }}
                        >
                          <span className="nav-icon">{subItem.icon}</span>
                          <span className="nav-text">{subItem.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-nav-footer">
          <div className="nav-user-info">
            <div className="nav-user-avatar">
              👤
            </div>
            <div className="nav-user-details">
              <span className="nav-user-name">John Doe</span>
              <span className="nav-user-role">Manager</span>
            </div>
          </div>
          <button className="mobile-nav-logout">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
