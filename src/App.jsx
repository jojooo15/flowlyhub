import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './hooks/useAppContext';
import Sidebar from './components/Sidebar';
import SidebarOverlay from './components/SidebarOverlay';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import History from './pages/History';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

/**
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 *
 * Aplikasi ini menggunakan React Context API untuk manajemen state.
 *
 * 1. Semua interaksi dengan API dilakukan melalui AppContext
 * 2. Fungsi-fungsi API didefinisikan di src/context/AppContext.jsx
 * 3. Implementasi API ada di src/services/api.js
 *
 * Untuk menghubungkan dengan backend:
 * 1. Ubah USE_MOCK_API menjadi false di src/config.js
 * 2. Sesuaikan API_BASE_URL dengan URL backend yang sebenarnya
 * 3. Pastikan endpoint API backend sesuai dengan yang diharapkan frontend
 */

function App() {
  const {
    isLoading,
    error,
    user,
    sidebarExpanded,
    fetchStockItems,
    setError
  } = useAppContext();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Always fetch stock items for CSV demo mode
    fetchStockItems();
  }, [fetchStockItems]);

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      )}

      {isAuthenticated && <Sidebar />}
      {isAuthenticated && <SidebarOverlay />}
      
      <div className={`main-content ${!isAuthenticated ? 'auth-layout' : ''} ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Tutup</button>
          </div>
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Catch-all route for non-existent pages */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
