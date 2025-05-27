/**
 * API Service Configuration
 * 
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 * 
 * File ini berisi konfigurasi dasar untuk koneksi ke backend API.
 * 1. Ganti BASE_URL dengan URL backend API yang sebenarnya
 * 2. Tambahkan endpoint API sesuai dengan struktur backend
 * 3. Pastikan format response sesuai dengan yang diharapkan frontend
 * 
 * Format response yang diharapkan:
 * {
 *   success: true/false,
 *   data: {...} atau [...],
 *   message: "Pesan sukses/error"
 * }
 */

// Base URL API - Ganti dengan URL backend yang sebenarnya
const BASE_URL = 'http://localhost:3000/api';

// Headers default untuk request
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Fungsi untuk menambahkan token autentikasi ke header
 * Akan digunakan setelah implementasi autentikasi
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Fungsi untuk melakukan HTTP request ke API
 * @param {string} endpoint - Endpoint API
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Data untuk dikirim (untuk POST, PUT)
 * @param {boolean} requireAuth - Apakah request memerlukan autentikasi
 * @returns {Promise} - Promise dengan hasil response
 */
const apiRequest = async (endpoint, method = 'GET', data = null, requireAuth = true) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      ...defaultHeaders,
      ...(requireAuth ? getAuthHeaders() : {}),
    };

    const options = {
      method,
      headers,
      credentials: 'include', // Untuk mengirim cookies jika diperlukan
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Terjadi kesalahan pada server');
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Objek API dengan method-method untuk setiap endpoint
 * INSTRUKSI: Tambahkan method sesuai dengan endpoint backend
 */
const api = {
  // Autentikasi
  auth: {
    login: (credentials) => apiRequest('/auth/login', 'POST', credentials, false),
    register: (userData) => apiRequest('/auth/register', 'POST', userData, false),
    logout: () => apiRequest('/auth/logout', 'POST'),
    getProfile: () => apiRequest('/auth/profile'),
  },

  // Stok Barang
  stock: {
    getAll: (params) => apiRequest('/stock', 'GET', null, true),
    getById: (id) => apiRequest(`/stock/${id}`, 'GET'),
    create: (stockData) => apiRequest('/stock', 'POST', stockData),
    update: (id, stockData) => apiRequest(`/stock/${id}`, 'PUT', stockData),
    delete: (id) => apiRequest(`/stock/${id}`, 'DELETE'),
    updateQuantity: (id, quantity) => apiRequest(`/stock/${id}/quantity`, 'PUT', { quantity }),
  },

  // Absensi
  attendance: {
    getAll: (params) => apiRequest('/attendance', 'GET', null, true),
    getById: (id) => apiRequest(`/attendance/${id}`, 'GET'),
    checkIn: (data) => apiRequest('/attendance/check-in', 'POST', data),
    checkOut: (id, data) => apiRequest(`/attendance/${id}/check-out`, 'PUT', data),
    getByDate: (date) => apiRequest(`/attendance/date/${date}`, 'GET'),
    getByEmployee: (employeeId) => apiRequest(`/attendance/employee/${employeeId}`, 'GET'),
  },

  // Riwayat Aktivitas
  history: {
    getAll: (params) => apiRequest('/history', 'GET', null, true),
    getById: (id) => apiRequest(`/history/${id}`, 'GET'),
    getByType: (type) => apiRequest(`/history/type/${type}`, 'GET'),
    getByDateRange: (startDate, endDate) => apiRequest(`/history/range?start=${startDate}&end=${endDate}`, 'GET'),
  },

  // Laporan
  reports: {
    getStockReport: (startDate, endDate) => apiRequest(`/reports/stock?start=${startDate}&end=${endDate}`, 'GET'),
    getAttendanceReport: (startDate, endDate) => apiRequest(`/reports/attendance?start=${startDate}&end=${endDate}`, 'GET'),
    getMonthlyReport: (month, year) => apiRequest(`/reports/monthly?month=${month}&year=${year}`, 'GET'),
    getYearlyReport: (year) => apiRequest(`/reports/yearly?year=${year}`, 'GET'),
    generatePdf: (reportType, params) => apiRequest(`/reports/pdf/${reportType}`, 'POST', params),
  },

  // Pengaturan
  settings: {
    getStoreProfile: () => apiRequest('/settings/store', 'GET'),
    updateStoreProfile: (profileData) => apiRequest('/settings/store', 'PUT', profileData),
    getUsers: () => apiRequest('/settings/users', 'GET'),
    createUser: (userData) => apiRequest('/settings/users', 'POST', userData),
    updateUser: (id, userData) => apiRequest(`/settings/users/${id}`, 'PUT', userData),
    deleteUser: (id) => apiRequest(`/settings/users/${id}`, 'DELETE'),
    backupData: () => apiRequest('/settings/backup', 'POST'),
    restoreData: (backupData) => apiRequest('/settings/restore', 'POST', backupData),
  },
};

export default api;
