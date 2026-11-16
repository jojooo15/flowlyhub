/**
 * config.js
 * 
 * Application configuration file
 */

// API Configuration
export const API_CONFIG = {
  // Base API URL
  API_BASE_URL: 'http://localhost:8086',
  
  // API timeout in milliseconds
  API_TIMEOUT: 30000,
  
  // Auth token key for localStorage
  AUTH_TOKEN_KEY: 'flowlyhub_token',
  
  // API version
  API_VERSION: 'v1'
};

// Feature flags
export const USE_MOCK_API = false; // Using real backend - data will persist in database

// Authentication
export const AUTH_TOKEN_KEY = 'flowlyhub_token'; // Consistent with API_CONFIG

// Date Format
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Pagination
export const ITEMS_PER_PAGE = 10;

// Theme
export const THEME = {
  primary: '#303F9F',
  secondary: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3'
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'FlowlyHub',
  APP_VERSION: '1.0.0',
  APP_MODE: import.meta.env.MODE || 'development',
  FEATURES: {
    STOCK_MANAGEMENT: true,
    ATTENDANCE: true,
    HISTORY: true,
    REPORTS: true,
    SETTINGS: true,
    NOTIFICATIONS: true,
    DARK_MODE: false
  }
};

// Storage Configuration
export const STORAGE_CONFIG = {
  AUTH_TOKEN_KEY: 'flowlyhub_token',
  USER_DATA_KEY: 'flowlyhub_user',
  SETTINGS_KEY: 'flowlyhub_settings',
  TOKEN_DURATION: 86400 // 24 hours
};

// Export configurations
export default {
  API_CONFIG,
  APP_CONFIG,
  STORAGE_CONFIG
};
