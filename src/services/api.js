/**
 * API Service Configuration - Real Backend Only
 * No mock data fallback - always connects to backend server
 */

import { API_CONFIG } from '../config.jsx';

const BASE_URL = API_CONFIG.API_BASE_URL;
const AUTH_TOKEN_KEY = API_CONFIG.AUTH_TOKEN_KEY;

// Default headers for API requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Get auth headers with token
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { 
      ...defaultHeaders, 
      'Authorization': `Bearer ${token}` 
    } : defaultHeaders;
  }
  return defaultHeaders;
};

// Handle API Request - Real backend only
const apiRequest = async (url, method = 'GET', body = null) => {
  console.log('🌐 Making API request to:', `${BASE_URL}${url}`, method, body);
  
  try {
    const config = {
      method,
      headers: getAuthHeaders(),
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, config);
    const result = await handleResponse(response);
    console.log('✅ API response:', result);
    return result;
  } catch (error) {
    console.error('❌ API request failed:', error.message);
    console.error('📍 Failed URL:', `${BASE_URL}${url}`);
    
    // Throw error instead of falling back to mock data
    throw new Error(`Backend API Error: ${error.message}. Please ensure backend server is running on ${BASE_URL}`);
  }
};

// Handle API Response
const handleResponse = async (response) => {
  const contentType = response.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json');

  let result;
  if (isJson) {
    try {
      result = await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }
  } else {
    const text = await response.text();
    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(result.message || result || 'Server error');
  }

  return {
    success: true,
    data: result.data || result,
    message: result.message || 'Success'
  };
};

// Export the API interface - Real backend endpoints only
const api = {
  auth: {
    login: async (credentials) => {
      return await apiRequest('/api/auth/login', 'POST', credentials);
    },
    register: async (userData) => {
      return await apiRequest('/api/auth/register', 'POST', userData);
    },
    logout: async () => {
      return await apiRequest('/api/auth/logout', 'POST');
    },
    getProfile: async () => {
      return await apiRequest('/api/auth/profile', 'GET');
    },
    refreshToken: async (refreshToken) => {
      return await apiRequest('/api/auth/refresh', 'POST', { refreshToken });
    },
    forgotPassword: async (data) => {
      return await apiRequest('/api/auth/forgot-password', 'POST', data);
    },
    verifyResetToken: async (token) => {
      return await apiRequest(`/api/auth/verify-reset-token/${token}`, 'GET');
    },
    resetPassword: async (token, data) => {
      return await apiRequest(`/api/auth/reset-password/${token}`, 'POST', data);
    }
  },

  attendance: {
    clockIn: async (data) => {
      return await apiRequest('/api/attendance/clock-in', 'POST', data);
    },
    clockOut: async (data) => {
      return await apiRequest('/api/attendance/clock-out', 'POST', data);
    },
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/attendance${query ? '?' + query : ''}`);
    },
    getById: async (id) => {
      return await apiRequest(`/api/attendance/${id}`);
    },
    getTodayStatus: async () => {
      return await apiRequest('/api/attendance/today/status');
    },
    update: async (id, data) => {
      return await apiRequest(`/api/attendance/${id}`, 'PUT', data);
    },
    delete: async (id) => {
      return await apiRequest(`/api/attendance/${id}`, 'DELETE');
    },
    // CSV-based endpoints
    getCsvData: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/attendance/csv-data${query ? '?' + query : ''}`);
    },
    getStats: async () => {
      return await apiRequest('/api/attendance/stats');
    },
    getEmployees: async () => {
      return await apiRequest('/api/attendance/employees');
    }
  },

  users: {
    getAll: async () => {
      return await apiRequest('/api/users');
    },
    update: async (id, data) => {
      return await apiRequest(`/api/users/${id}`, 'PUT', data);
    },
    delete: async (id) => {
      return await apiRequest(`/api/users/${id}`, 'DELETE');
    }
  },
  stock: {
    getAll: async () => {
      return await apiRequest('/api/stock');
    },
    getById: async (id) => {
      return await apiRequest(`/api/stock/${id}`);
    },
    create: async (data) => {
      return await apiRequest('/api/stock', 'POST', data);
    },
    update: async (id, data) => {
      return await apiRequest(`/api/stock/${id}`, 'PUT', data);
    },
    delete: async (id) => {
      return await apiRequest(`/api/stock/${id}`, 'DELETE');
    },    // CSV endpoints have been deprecated - data migrated to database
    getCsvData: async () => {
      throw new Error('CSV endpoints have been deprecated. All data is now served from database. Use getAll() instead.');
    },
    getAnalytics: async () => {
      throw new Error('CSV analytics endpoints have been deprecated. Use database analytics instead.');
    },
    getProducts: async () => {
      throw new Error('CSV products endpoints have been deprecated. Use getAll() instead.');
    },
    predict : async(data)=>{
      return await apiRequest('/api/ai/stock/predict', 'POST', data);
    }
  },

  reports: {
    getStock: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/stock${query ? '?' + query : ''}`);
    },
    getAttendance: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/attendance${query ? '?' + query : ''}`);
    },
    getMonthly: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/monthly${query ? '?' + query : ''}`);
    },
    getYearly: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/yearly${query ? '?' + query : ''}`);
    },
    // CSV-based endpoints for real financial data from backend
    getCsvFinancial: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/csv-financial${query ? '?' + query : ''}`);
    },
    getCsvStock: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/csv-stock${query ? '?' + query : ''}`);
    },
    getCsvAttendance: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/csv-attendance${query ? '?' + query : ''}`);
    },
    getTransactions: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/reports/transactions/financial${query ? '?' + query : ''}`);
    },
    createTransaction : async (data) => {
      return await apiRequest('/api/reports/transactions', 'POST', data);
    }
  },

  transactions: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/api/transactions${query ? '?' + query : ''}`);
    },
    getById: async (id) => {
      return await apiRequest(`/api/transactions/${id}`);
    },
    create: async (data) => {
      return await apiRequest('/api/transactions', 'POST', data);
    },
    updateStatus: async (id, status) => {
      return await apiRequest(`/api/transactions/${id}/status`, 'PATCH', { status });
    },
    delete: async (id) => {
      return await apiRequest(`/api/transactions/${id}`, 'DELETE');
    },
    getDailyReport: async (date) => {
      return await apiRequest(`/api/transactions/reports/daily?date=${date}`);
    }
  },

  ai: {
    getAnalytics: async () => {
      return await apiRequest('/api/ai/analytics');
    },
    predictStock: async (stockId, days = 30) => {
      return await apiRequest('/api/ai/stock/predict', 'POST', { stockId, days });
    },
    getSalesAnalytics: async (period = '30d') => {
      return await apiRequest(`/api/ai/sales/analytics?period=${period}`);
    },
    optimizePricing: async (stockId) => {
      return await apiRequest('/api/ai/pricing/optimize', 'POST', { stockId });
    },
    optimizeInventory: async () => {
      return await apiRequest('/api/ai/inventory/optimize');
    },
    forecastDemand: async (category, timeframe = '7d') => {
      return await apiRequest('/api/ai/demand/forecast', 'POST', { category, timeframe });
    }
  }
};

export default api;
