/**
 * excelGenerator.js
 * 
 * Utility untuk menghasilkan file Excel dari data
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Fungsi untuk mengkonversi data ke format Excel dan download
 * @param {Array} data - Data yang akan diexport
 * @param {string} filename - Nama file Excel
 * @param {string} sheetName - Nama sheet Excel
 */
export const exportToExcel = (data, filename = 'data.xlsx', sheetName = 'Sheet1') => {
  try {
    // Membuat workbook baru
    const workbook = XLSX.utils.book_new();
    
    // Mengkonversi data ke worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Menambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Menulis workbook ke buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    // Membuat blob dan download
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Gagal mengexport data ke Excel');
  }
};

/**
 * Fungsi untuk export data absensi ke Excel
 * @param {Array} attendanceData - Data absensi
 * @param {Object} params - Parameter export (tanggal, dll)
 */
export const exportAttendanceToExcel = (attendanceData, params = {}) => {
  try {
    // Format data untuk Excel
    const formattedData = attendanceData.map((item, index) => ({
      'No': index + 1,
      'ID Karyawan': item.id_karyawan,
      'Nama Karyawan': item.nama_karyawan,
      'Tanggal': item.tanggal,
      'Jam Masuk': item.jam_masuk,
      'Jam Jadwal': item.jam_jadwal,
      'Status': item.terlambat === 0 ? 'Tepat Waktu' : 'Terlambat',
      'Cuaca': item.cuaca,
      'Hari': item.hari
    }));
    
    // Generate filename dengan tanggal
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `Laporan_Absensi_${dateStr}.xlsx`;
    
    exportToExcel(formattedData, filename, 'Data Absensi');
    
    return true;
  } catch (error) {
    console.error('Error exporting attendance to Excel:', error);
    throw error;
  }
};

/**
 * Fungsi untuk export data stok ke Excel
 * @param {Array} stockData - Data stok
 * @param {Object} params - Parameter export
 */
export const exportStockToExcel = (stockData, params = {}) => {
  try {
    const formattedData = stockData.map((item, index) => ({
      'No': index + 1,
      'Kode': item.code || item.kode,
      'Nama Barang': item.name || item.nama,
      'Kategori': item.category || item.kategori,
      'Stok': item.stock || item.stok,
      'Harga': item.price || item.harga,
      'Status': item.status
    }));
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `Laporan_Stok_${dateStr}.xlsx`;
    
    exportToExcel(formattedData, filename, 'Data Stok');
    
    return true;
  } catch (error) {
    console.error('Error exporting stock to Excel:', error);
    throw error;
  }
};

/**
 * Fungsi untuk export data transaksi ke Excel
 * @param {Array} transactionData - Data transaksi
 * @param {Object} params - Parameter export
 */
export const exportTransactionsToExcel = (transactionData, params = {}) => {
  try {
    const formattedData = transactionData.map((item, index) => ({
      'No': index + 1,
      'Tanggal': item.tanggal,
      'Jenis Transaksi': item.jenis_transaksi,
      'Kategori': item.kategori_transaksi,
      'Jumlah (Rp)': item.jumlah,
      'Keterangan': item.keterangan
    }));
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `Laporan_Transaksi_${dateStr}.xlsx`;
    
    exportToExcel(formattedData, filename, 'Data Transaksi');
    
    return true;
  } catch (error) {
    console.error('Error exporting transactions to Excel:', error);
    throw error;
  }
};

export default {
  exportToExcel,
  exportAttendanceToExcel,
  exportStockToExcel,
  exportTransactionsToExcel
};
