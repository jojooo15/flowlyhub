/**
 * services/index.js
 * 
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 * 
 * File ini mengekspor API yang akan digunakan oleh aplikasi.
 * 
 * 1. Saat pengembangan frontend, aplikasi menggunakan mockApi
 * 2. Setelah backend selesai, aplikasi akan menggunakan API yang sebenarnya
 * 3. Ubah USE_MOCK_API di config.js menjadi false untuk menggunakan API yang sebenarnya
 */

import { API_CONFIG } from '../config';
import realApi from './api';
import mockApi from './mockApi';

// Ekspor API berdasarkan konfigurasi
const api = API_CONFIG.USE_MOCK_API ? mockApi : realApi;

export default api;
