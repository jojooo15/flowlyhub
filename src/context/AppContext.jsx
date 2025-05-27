/**
 * AppContext.jsx
 *
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 *
 * File ini berisi Context API untuk mengelola state aplikasi dan interaksi dengan backend.
 * 1. Implementasikan fungsi-fungsi yang berinteraksi dengan API
 * 2. Pastikan response dari API diproses dengan benar
 * 3. Tambahkan state dan fungsi sesuai kebutuhan fitur baru
 *
 * Struktur data yang diharapkan dari backend:
 * - Stok: { id, name, category, quantity, unit, price, status }
 * - Absensi: { id, date, employeeId, employeeName, checkInTime, scheduledTime, isLate, weather, dayOfWeek }
 * - Riwayat: { id, timestamp, activityType, userId, userName, details }
 * - Laporan: Sesuai dengan jenis laporan
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Membuat context
const AppContext = createContext();

// Custom hook untuk menggunakan context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // State untuk autentikasi
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk data aplikasi
  const [stockItems, setStockItems] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [storeProfile, setStoreProfile] = useState({});

  /**
   * Fungsi untuk login
   * @param {object} credentials - Email dan password
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.auth.login(credentials);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi untuk logout
   */
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Fungsi untuk mengambil profil pengguna
   */
  const fetchUserProfile = async () => {
    if (!localStorage.getItem('token')) return;

    setIsLoading(true);
    try {
      const response = await api.auth.getProfile();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi-fungsi untuk Stok Barang
  const fetchStockItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.stock.getAll();
      if (response.success) {
        setStockItems(response.data);
      }
    } catch (err) {
      setError('Gagal mengambil data stok barang');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addStockItem = async (itemData) => {
    setIsLoading(true);
    try {
      const response = await api.stock.create(itemData);
      if (response.success) {
        setStockItems([...stockItems, response.data]);
        return true;
      }
    } catch (err) {
      setError('Gagal menambahkan barang');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStockItem = async (id, itemData) => {
    setIsLoading(true);
    try {
      const response = await api.stock.update(id, itemData);
      if (response.success) {
        setStockItems(stockItems.map(item =>
          item.id === id ? response.data : item
        ));
        return true;
      }
    } catch (err) {
      setError('Gagal memperbarui barang');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStockItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.stock.delete(id);
      if (response.success) {
        setStockItems(stockItems.filter(item => item.id !== id));
        return true;
      }
    } catch (err) {
      setError('Gagal menghapus barang');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi-fungsi untuk Absensi
  const fetchAttendanceRecords = async (date) => {
    setIsLoading(true);
    try {
      const response = await api.attendance.getByDate(date);
      if (response.success) {
        setAttendanceRecords(response.data);
      }
    } catch (err) {
      setError('Gagal mengambil data absensi');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAttendanceRecords = async () => {
    setIsLoading(true);
    try {
      const response = await api.attendance.getAll();
      if (response.success) {
        setAttendanceRecords(response.data);
      }
    } catch (err) {
      setError('Gagal mengambil data absensi');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendanceByDateRange = async (startDate, endDate) => {
    setIsLoading(true);
    try {
      const response = await api.attendance.getByDateRange(startDate, endDate);
      if (response.success) {
        setAttendanceRecords(response.data);
        return response.data;
      }
    } catch (err) {
      setError('Gagal mengambil data absensi');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const recordAttendance = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.attendance.recordAttendance(data);
      if (response.success) {
        setAttendanceRecords([...attendanceRecords, response.data]);
        return true;
      }
    } catch (err) {
      setError('Gagal merekam absensi');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAttendance = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await api.attendance.updateAttendance(id, data);
      if (response.success) {
        setAttendanceRecords(attendanceRecords.map(record =>
          record.id === id ? response.data : record
        ));
        return true;
      }
    } catch (err) {
      setError('Gagal memperbarui data absensi');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherStats = async (startDate, endDate) => {
    setIsLoading(true);
    try {
      const response = await api.attendance.getWeatherStats(startDate, endDate);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError('Gagal mengambil statistik cuaca');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi-fungsi untuk Riwayat
  const fetchHistoryRecords = async (params) => {
    setIsLoading(true);
    try {
      const response = await api.history.getAll(params);
      if (response.success) {
        setHistoryRecords(response.data);
      }
    } catch (err) {
      setError('Gagal mengambil data riwayat');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi-fungsi untuk Laporan
  const generateReport = async (reportType, params) => {
    setIsLoading(true);
    try {
      let response;
      switch (reportType) {
        case 'stock':
          response = await api.reports.getStockReport(params.startDate, params.endDate);
          break;
        case 'attendance':
          response = await api.reports.getAttendanceReport(params.startDate, params.endDate);
          break;
        case 'monthly':
          response = await api.reports.getMonthlyReport(params.month, params.year);
          break;
        case 'yearly':
          response = await api.reports.getYearlyReport(params.year);
          break;
        default:
          throw new Error('Jenis laporan tidak valid');
      }

      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError('Gagal membuat laporan');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePdfReport = async (reportType, params) => {
    setIsLoading(true);
    try {
      const response = await api.reports.generatePdf(reportType, params);
      if (response.success) {
        // Buka PDF dalam tab baru atau download
        window.open(response.data.pdfUrl, '_blank');
        return true;
      }
    } catch (err) {
      setError('Gagal membuat PDF');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi-fungsi untuk Pengaturan
  const fetchStoreProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.settings.getStoreProfile();
      if (response.success) {
        setStoreProfile(response.data);
      }
    } catch (err) {
      // setError('Gagal mengambil profil toko'); // Dinonaktifkan sementara
      console.error('Store profile fetch disabled:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoreProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const response = await api.settings.updateStoreProfile(profileData);
      if (response.success) {
        setStoreProfile(response.data);
        return true;
      }
    } catch (err) {
      // setError('Gagal memperbarui profil toko'); // Dinonaktifkan sementara
      console.error('Store profile update disabled:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cek autentikasi saat aplikasi dimuat
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Nilai yang akan disediakan oleh context
  const contextValue = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    stockItems,
    attendanceRecords,
    historyRecords,
    storeProfile,

    // Fungsi autentikasi
    login,
    logout,

    // Fungsi stok barang
    fetchStockItems,
    addStockItem,
    updateStockItem,
    deleteStockItem,

    // Fungsi absensi
    fetchAttendanceRecords,
    fetchAllAttendanceRecords,
    fetchAttendanceByDateRange,
    recordAttendance,
    updateAttendance,
    getWeatherStats,

    // Fungsi riwayat
    fetchHistoryRecords,

    // Fungsi laporan
    generateReport,
    generatePdfReport,

    // Fungsi pengaturan
    fetchStoreProfile,
    updateStoreProfile,

    // Fungsi utilitas
    setError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
