import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/SidebarOverlay.css';

const SidebarOverlay = () => {
  const { sidebarExpanded, setSidebarExpanded } = useAppContext();

  const handleOverlayClick = () => {
    setSidebarExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSidebarExpanded(false);
    }
  };

  if (!sidebarExpanded) return null;

  return (
    <div 
      className="sidebar-overlay"
      onClick={handleOverlayClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Close sidebar"
    />
  );
};

export default SidebarOverlay;
