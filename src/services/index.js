import api from './api';
import { USE_MOCK_API } from '../config.jsx';

// Always use real API since USE_MOCK_API is set to false in config
// Mock API is completely removed to ensure production-ready backend connection
const service = api;

// Export both named and default exports for flexibility
export { service, api };
export default service;
