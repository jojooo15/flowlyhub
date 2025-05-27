/**
 * mockApi.js
 *
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 *
 * File ini berisi implementasi API palsu untuk pengembangan frontend.
 *
 * 1. Gunakan sebagai referensi untuk implementasi API backend yang sebenarnya
 * 2. Pastikan endpoint API backend mengembalikan data dengan struktur yang sama
 * 3. Hapus file ini setelah backend selesai diimplementasikan
 *
 * Catatan: File ini hanya untuk pengembangan dan tidak boleh digunakan di produksi.
 */

import {
  stockData,
  employeeData,
  attendanceData,
  reportData,
  storeProfile,
  userData,
  createMockResponse
} from './mockData';

// Simulasi delay jaringan
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk mencari item berdasarkan ID
const findById = (array, id) => array.find(item => item.id === parseInt(id));

// Mock API untuk autentikasi
const authApi = {
  login: async (credentials) => {
    await delay(500);

    const user = userData.find(u =>
      u.username === credentials.username && credentials.password === 'password'
    );

    if (user) {
      return createMockResponse({
        token: 'mock-jwt-token',
        user: { ...user, password: undefined }
      });
    } else {
      throw new Error('Username atau password salah');
    }
  },

  register: async (userData) => {
    await delay(500);
    return createMockResponse({ ...userData, id: 4, password: undefined });
  },

  logout: async () => {
    await delay(300);
    return createMockResponse({ success: true });
  },

  getProfile: async () => {
    await delay(300);
    return createMockResponse(userData[0]);
  }
};

// Mock API untuk stok barang
const stockApi = {
  getAll: async () => {
    await delay(500);
    return createMockResponse(stockData);
  },

  getById: async (id) => {
    await delay(300);
    const item = findById(stockData, id);

    if (item) {
      return createMockResponse(item);
    } else {
      throw new Error('Menu tidak ditemukan');
    }
  },

  create: async (stockItem) => {
    await delay(500);
    // Calculate total_penjualan
    const total_penjualan = stockItem.jumlah_terjual * stockItem.harga_satuan;

    const newItem = {
      ...stockItem,
      id: stockData.length + 1,
      total_penjualan
    };

    return createMockResponse(newItem);
  },

  update: async (id, stockItem) => {
    await delay(500);
    const index = stockData.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      // Recalculate total_penjualan if necessary
      let total_penjualan = stockData[index].total_penjualan;

      if (stockItem.jumlah_terjual || stockItem.harga_satuan) {
        const jumlah_terjual = stockItem.jumlah_terjual || stockData[index].jumlah_terjual;
        const harga_satuan = stockItem.harga_satuan || stockData[index].harga_satuan;
        total_penjualan = jumlah_terjual * harga_satuan;
      }

      const updatedItem = {
        ...stockData[index],
        ...stockItem,
        total_penjualan
      };

      return createMockResponse(updatedItem);
    } else {
      throw new Error('Menu tidak ditemukan');
    }
  },

  delete: async (id) => {
    await delay(500);
    const index = stockData.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      return createMockResponse({ success: true });
    } else {
      throw new Error('Menu tidak ditemukan');
    }
  },

  getByDate: async (date) => {
    await delay(500);
    const records = stockData.filter(record => record.tanggal === date);
    return createMockResponse(records);
  },

  getByCategory: async (category) => {
    await delay(500);
    const records = stockData.filter(record => record.kategori_menu === category);
    return createMockResponse(records);
  },

  getByDateRange: async (startDate, endDate) => {
    await delay(500);

    // Convert dates to comparable format (assuming DD-MM-YY format)
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = stockData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    return createMockResponse(records);
  },

  getSalesSummary: async (startDate, endDate) => {
    await delay(500);

    // Get stock records in date range
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = stockData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    // Calculate summary
    const summary = {
      totalSales: 0,
      totalItems: 0,
      categories: {},
      menuItems: {}
    };

    records.forEach(record => {
      summary.totalSales += record.total_penjualan;
      summary.totalItems += record.jumlah_terjual;

      // Track categories
      const category = record.kategori_menu;
      if (!summary.categories[category]) {
        summary.categories[category] = {
          count: 0,
          total: 0
        };
      }

      summary.categories[category].count += record.jumlah_terjual;
      summary.categories[category].total += record.total_penjualan;

      // Track menu items
      const menuName = record.nama_menu;
      if (!summary.menuItems[menuName]) {
        summary.menuItems[menuName] = {
          count: 0,
          total: 0
        };
      }

      summary.menuItems[menuName].count += record.jumlah_terjual;
      summary.menuItems[menuName].total += record.total_penjualan;
    });

    return createMockResponse(summary);
  }
};

// Mock API untuk absensi
const attendanceApi = {
  getAll: async () => {
    await delay(500);
    return createMockResponse(attendanceData);
  },

  getById: async (id) => {
    await delay(300);
    const record = findById(attendanceData, id);

    if (record) {
      return createMockResponse(record);
    } else {
      throw new Error('Data absensi tidak ditemukan');
    }
  },

  recordAttendance: async (data) => {
    await delay(500);
    // Calculate if employee is late
    const jam_jadwal = data.jam_jadwal || '8:00';
    const jam_masuk = data.jam_masuk;

    // Convert times to minutes for comparison
    const getMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const scheduledMinutes = getMinutes(jam_jadwal);
    const checkInMinutes = getMinutes(jam_masuk);

    // Employee is late if check-in time is after scheduled time
    const terlambat = checkInMinutes > scheduledMinutes ? 1 : 0;

    // Get day of week
    const dateParts = data.tanggal.split('-');
    const dateObj = new Date(`20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hari = days[dateObj.getDay()];

    const newRecord = {
      ...data,
      id: attendanceData.length + 1,
      terlambat,
      hari
    };

    return createMockResponse(newRecord);
  },

  updateAttendance: async (id, data) => {
    await delay(500);
    const record = findById(attendanceData, id);

    if (record) {
      // Recalculate if employee is late if check-in time is updated
      let terlambat = record.terlambat;

      if (data.jam_masuk && data.jam_jadwal) {
        // Convert times to minutes for comparison
        const getMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const scheduledMinutes = getMinutes(data.jam_jadwal);
        const checkInMinutes = getMinutes(data.jam_masuk);

        // Employee is late if check-in time is after scheduled time
        terlambat = checkInMinutes > scheduledMinutes ? 1 : 0;
      }

      const updatedRecord = {
        ...record,
        ...data,
        terlambat
      };

      return createMockResponse(updatedRecord);
    } else {
      throw new Error('Data absensi tidak ditemukan');
    }
  },

  getByDate: async (date) => {
    await delay(500);
    const records = attendanceData.filter(record => record.tanggal === date);
    return createMockResponse(records);
  },

  getByEmployee: async (employeeId) => {
    await delay(500);
    const records = attendanceData.filter(record => record.id_karyawan === parseInt(employeeId));
    return createMockResponse(records);
  },

  getByDateRange: async (startDate, endDate) => {
    await delay(500);

    // Convert dates to comparable format (assuming DD-MM-YY format)
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = attendanceData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    return createMockResponse(records);
  },

  getWeatherStats: async (startDate, endDate) => {
    await delay(500);

    // Get attendance records in date range
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = attendanceData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    // Calculate statistics
    const weatherStats = {
      Hujan: {
        count: 0,
        lateCount: 0,
        latePercentage: 0
      },
      Berawan: {
        count: 0,
        lateCount: 0,
        latePercentage: 0
      },
      Cerah: {
        count: 0,
        lateCount: 0,
        latePercentage: 0
      }
    };

    records.forEach(record => {
      const weather = record.cuaca;
      weatherStats[weather].count++;

      if (record.terlambat === 1) {
        weatherStats[weather].lateCount++;
      }
    });

    // Calculate percentages
    Object.keys(weatherStats).forEach(weather => {
      const stats = weatherStats[weather];
      stats.latePercentage = stats.count > 0
        ? Math.round((stats.lateCount / stats.count) * 100)
        : 0;
    });

    return createMockResponse(weatherStats);
  }
};

// Mock API untuk laporan transaksi
const reportApi = {
  getAll: async () => {
    await delay(500);
    return createMockResponse(reportData);
  },

  getById: async (id) => {
    await delay(300);
    const record = findById(reportData, id);

    if (record) {
      return createMockResponse(record);
    } else {
      throw new Error('Data laporan tidak ditemukan');
    }
  },

  getByType: async (type) => {
    await delay(500);
    const records = reportData.filter(record => record.jenis_transaksi === type);
    return createMockResponse(records);
  },

  getByCategory: async (category) => {
    await delay(500);
    const records = reportData.filter(record => record.kategori_transaksi === category);
    return createMockResponse(records);
  },

  getByDateRange: async (startDate, endDate) => {
    await delay(500);

    // Convert dates to comparable format (assuming DD-MM-YY format)
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = reportData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    return createMockResponse(records);
  },

  getSummary: async (startDate, endDate) => {
    await delay(500);

    // Get reports in date range
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(`20${year}`, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const records = reportData.filter(record => {
      const recordDate = parseDate(record.tanggal);
      return recordDate >= start && recordDate <= end;
    });

    // Calculate summary
    const summary = {
      totalPemasukan: 0,
      totalPengeluaran: 0,
      netProfit: 0,
      transactionCount: records.length,
      categories: {}
    };

    records.forEach(record => {
      if (record.jenis_transaksi === 'Pemasukan') {
        summary.totalPemasukan += record.jumlah;
      } else if (record.jenis_transaksi === 'Pengeluaran') {
        summary.totalPengeluaran += record.jumlah;
      }

      // Track categories
      const category = record.kategori_transaksi;
      if (!summary.categories[category]) {
        summary.categories[category] = {
          count: 0,
          total: 0
        };
      }

      summary.categories[category].count++;
      summary.categories[category].total += record.jumlah;
    });

    summary.netProfit = summary.totalPemasukan - summary.totalPengeluaran;

    return createMockResponse(summary);
  }
};

// Mock API untuk laporan
const reportsApi = {
  getStockReport: async (startDate, endDate) => {
    await delay(1000);
    return createMockResponse(stockData);
  },

  getAttendanceReport: async (startDate, endDate) => {
    await delay(1000);
    return createMockResponse(attendanceData);
  },

  getMonthlyReport: async (month, year) => {
    await delay(1000);

    // Simulasi data laporan bulanan
    const monthlyReport = {
      month,
      year,
      summary: {
        totalSales: 15250000,
        totalExpenses: 8500000,
        profit: 6750000,
        stockValue: 4774000,
        attendanceRate: 90
      },
      details: {
        // Detail laporan bulanan
      }
    };

    return createMockResponse(monthlyReport);
  },

  getYearlyReport: async (year) => {
    await delay(1000);

    // Simulasi data laporan tahunan
    const yearlyReport = {
      year,
      summary: {
        totalSales: 183000000,
        totalExpenses: 102000000,
        profit: 81000000,
        stockValue: 4774000,
        attendanceRate: 92
      },
      monthlyData: [
        // Data per bulan
      ],
      details: {
        // Detail laporan tahunan
      }
    };

    return createMockResponse(yearlyReport);
  },

  generatePdf: async (reportType, params) => {
    await delay(1500);

    // Simulasi URL untuk mengunduh PDF
    return createMockResponse({
      pdfUrl: `https://example.com/reports/${reportType}_${new Date().getTime()}.pdf`
    });
  }
};

// Mock API untuk pengaturan
const settingsApi = {
  getStoreProfile: async () => {
    await delay(500);
    return createMockResponse(storeProfile);
  },

  updateStoreProfile: async (profileData) => {
    await delay(500);
    const updatedProfile = {
      ...storeProfile,
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return createMockResponse(updatedProfile);
  },

  getUsers: async () => {
    await delay(500);
    return createMockResponse(userData);
  },

  createUser: async (userData) => {
    await delay(500);
    const newUser = {
      ...userData,
      id: userData.length + 1,
      createdAt: new Date().toISOString()
    };

    return createMockResponse(newUser);
  },

  updateUser: async (id, userData) => {
    await delay(500);
    const user = findById(userData, id);

    if (user) {
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString()
      };

      return createMockResponse(updatedUser);
    } else {
      throw new Error('Pengguna tidak ditemukan');
    }
  },

  deleteUser: async (id) => {
    await delay(500);
    return createMockResponse({ success: true });
  },

  backupData: async () => {
    await delay(1500);
    return createMockResponse({
      backupId: `backup_${new Date().getTime()}`,
      timestamp: new Date().toISOString(),
      size: '2.5 MB'
    });
  },

  restoreData: async (backupData) => {
    await delay(2000);
    return createMockResponse({ success: true });
  }
};

// Objek API dengan semua endpoint
const mockApi = {
  auth: authApi,
  stock: stockApi,
  attendance: attendanceApi,
  report: reportApi,
  reports: reportsApi,
  settings: settingsApi
};

export default mockApi;
