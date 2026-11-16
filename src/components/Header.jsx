import React from 'react';
import PropTypes from 'prop-types';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/Header.css';

const Header = ({ title = 'Dashboard' }) => {
  const { sidebarExpanded, setSidebarExpanded } = useAppContext();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <header className="page-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {sidebarExpanded ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-right">
        {/* Additional header content can be added here */}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string
};

export default Header;
