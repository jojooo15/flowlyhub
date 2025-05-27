/**
 * config.js
 * 
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 * 
 * File ini berisi konfigurasi aplikasi.
 * 
 * 1. Ubah USE_MOCK_API menjadi false setelah backend selesai diimplementasikan
 * 2. Sesuaikan API_BASE_URL dengan URL backend yang sebenarnya
 * 3. Tambahkan konfigurasi lain yang diperlukan
 */

// Konfigurasi API
export const API_CONFIG = {
  // Gunakan API palsu untuk pengembangan frontend
  USE_MOCK_API: true,
  
  // URL dasar API backend
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Timeout request API (dalam milidetik)
  API_TIMEOUT: 30000,
  
  // Versi API
  API_VERSION: 'v1'
};

// Konfigurasi aplikasi
export const APP_CONFIG = {
  // Nama aplikasi
  APP_NAME: 'FlowlyHub',
  
  // Versi aplikasi
  APP_VERSION: '1.0.0',
  
  // Mode aplikasi (development, production, test)
  APP_MODE: process.env.NODE_ENV || 'development',
  
  // Fitur yang diaktifkan
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

// Konfigurasi penyimpanan lokal
export const STORAGE_CONFIG = {
  // Kunci untuk token autentikasi
  AUTH_TOKEN_KEY: 'flowlyhub_token',
  
  // Kunci untuk data pengguna
  USER_DATA_KEY: 'flowlyhub_user',
  
  // Kunci untuk pengaturan aplikasi
  SETTINGS_KEY: 'flowlyhub_settings',
  
  // Durasi token (dalam detik)
  TOKEN_DURATION: 86400 // 24 jam
};

export default {
  API_CONFIG,
  APP_CONFIG,
  STORAGE_CONFIG
};
