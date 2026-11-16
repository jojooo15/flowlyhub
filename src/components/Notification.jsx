import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import '../styles/Notification.css';

const Notification = ({ type = 'success', message, isVisible, onClose, autoClose = true, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = window.setTimeout(() => {
        onClose();
      }, duration);
      
      return () => window.clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon" />;
      case 'error':
        return <FaExclamationTriangle className="notification-icon" />;
      default:
        return <FaCheckCircle className="notification-icon" />;
    }
  };

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="notification-content">
        {getIcon()}
        <span className="notification-message">{message}</span>
      </div>
      <button 
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  autoClose: PropTypes.bool,
  duration: PropTypes.number
};

export default Notification;
