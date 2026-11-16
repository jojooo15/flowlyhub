import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaBox,
  FaUserClock,
  FaHistory,
  FaFileAlt,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, sidebarExpanded, setSidebarExpanded } = useAppContext();
  
  const menuItems = [
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Stok Barang' },
    { path: '/attendance', icon: <FaUserClock />, label: 'Absensi' },
    { path: '/history', icon: <FaHistory />, label: 'Riwayat' },
    { path: '/reports', icon: <FaFileAlt />, label: 'Laporan' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      // Close sidebar on mobile after logout
      if (window.innerWidth <= 768) {
        setSidebarExpanded(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
    }
  };

  const handleMouseEnter = () => {
    // Only expand on hover for desktop
    if (window.innerWidth > 768) {
      setSidebarExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // Only collapse on mouse leave for desktop
    if (window.innerWidth > 768) {
      setSidebarExpanded(false);
    }
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (window.innerWidth <= 768) {
      setSidebarExpanded(false);
    }
  };

  return (
    <div 
      className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <img src="/flowlyhub-logo.png" alt="FlowlyHub Logo" className="sidebar-logo" />
        <h2>FlowlyHub</h2>
      </div>
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} onClick={handleNavClick}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout} title="Logout">
          <span className="icon"><FaSignOutAlt /></span>
          <span className="label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
