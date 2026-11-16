import {
  stockData,
  userData,
  attendanceData,
  reportData,
  storeProfile,
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
    }
    throw new Error('Username atau password salah');
  },

  register: async (userData) => {
    await delay(500);
    return createMockResponse({
      success: true,
      message: 'Registrasi berhasil'
    });
  },

  logout: async () => {
    await delay(300);
    return createMockResponse({ success: true });
  },

  getProfile: async () => {
    await delay(300);
    return createMockResponse(userData[0]);
  },

  forgotPassword: async ({ email }) => {
    await delay(500);
    const user = userData.find(u => u.email === email);
    if (user) {
      return createMockResponse({
        success: true,
        message: 'Link reset password telah dikirim ke email Anda'
      });
    }
    throw new Error('Email tidak terdaftar');
  },

  resetPassword: async (token, { password }) => {
    await delay(500);
    return createMockResponse({
      success: true,
      message: 'Password berhasil diubah'
    });
  }
};

// Utility function for validating input data
const validateData = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !(field in data));
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

// Enhanced stockApi with validation and better error handling
const stockApi = {
  getStockItems: async () => {
    try {
      await delay(500);
      return createMockResponse(stockData);
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
  },

  getAll: async () => {
    try {
      await delay(500);
      return createMockResponse(stockData);
    } catch (error) {
      throw new Error(`Failed to fetch stock data: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      await delay(300);
      const item = findById(stockData, id);
      if (!item) throw new Error('Item not found');
      return createMockResponse(item);
    } catch (error) {
      throw new Error(`Failed to fetch item by ID: ${error.message}`);
    }
  },

  create: async (data) => {
    try {
      validateData(data, ['nama_menu', 'jumlah_terjual', 'harga_satuan']);
      await delay(500);
      const newItem = {
        id: stockData.length + 1,
        ...data,
        total_penjualan: data.jumlah_terjual * data.harga_satuan
      };
      stockData.push(newItem);
      return createMockResponse(newItem);
    } catch (error) {
      throw new Error(`Failed to create stock item: ${error.message}`);
    }
  },

  update: async (id, data) => {
    try {
      validateData(data, ['jumlah_terjual', 'harga_satuan']);
      await delay(500);
      const index = stockData.findIndex(item => item.id === parseInt(id));
      if (index === -1) throw new Error('Item not found');

      stockData[index] = {
        ...stockData[index],
        ...data,
        total_penjualan: data.jumlah_terjual * data.harga_satuan
      };
      return createMockResponse(stockData[index]);
    } catch (error) {
      throw new Error(`Failed to update stock item: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      await delay(500);
      const index = stockData.findIndex(item => item.id === parseInt(id));
      if (index === -1) throw new Error('Item not found');

      stockData.splice(index, 1);
      return createMockResponse({ success: true });
    } catch (error) {
      throw new Error(`Failed to delete stock item: ${error.message}`);
    }
  }
};

// Create unified mock API
const mockApi = {
  auth: authApi,
  stock: stockApi
};

export { mockApi };
export default mockApi;
