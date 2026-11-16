/**
 * pdfGenerator.js
 * 
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 * 
 * File ini berisi fungsi-fungsi untuk menghasilkan PDF di sisi klien.
 * Untuk implementasi yang lebih baik, sebaiknya pembuatan PDF dilakukan di backend.
 * 
 * 1. Implementasikan endpoint di backend untuk menghasilkan PDF
 * 2. Endpoint harus menerima parameter jenis laporan dan filter
 * 3. Backend harus mengembalikan URL untuk mengunduh PDF atau stream PDF langsung
 * 
 * Catatan: File ini hanya sebagai fallback jika pembuatan PDF di backend belum tersedia.
 * Gunakan library seperti PDFKit, jsPDF, atau Puppeteer di backend untuk hasil yang lebih baik.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Fungsi untuk membuat header laporan PDF
 * @param {object} doc - Objek jsPDF
 * @param {string} title - Judul laporan
 * @param {string} subtitle - Subjudul laporan (opsional)
 * @param {object} storeProfile - Informasi toko
 */
const addReportHeader = (doc, title, subtitle, storeProfile) => {
  // Logo toko (jika ada)
  // doc.addImage(storeProfile.logoUrl, 'PNG', 14, 10, 30, 30);
  
  // Judul laporan
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 105, 20, { align: 'center' });
  
  // Informasi toko
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(storeProfile.name || 'Nama Toko', 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(storeProfile.address || 'Alamat Toko', 105, 35, { align: 'center' });
  doc.text(storeProfile.phone || 'Telepon Toko', 105, 40, { align: 'center' });
  
  // Subjudul (jika ada)
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 105, 50, { align: 'center' });
  }
  
  // Garis pemisah
  doc.setLineWidth(0.5);
  doc.line(14, 55, 196, 55);
};

/**
 * Fungsi untuk membuat footer laporan PDF
 * @param {object} doc - Objek jsPDF
 */
const addReportFooter = (doc) => {
  const totalPages = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString('id-ID')}`,
      14,
      doc.internal.pageSize.height - 10
    );
    
    // Page numbers
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      doc.internal.pageSize.width - 14,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
};

/**
 * Fungsi untuk membuat laporan stok barang
 * @param {array} stockData - Data stok barang
 * @param {object} params - Parameter laporan (periode, dll)
 * @param {object} storeProfile - Informasi toko
 * @returns {jsPDF} - Objek PDF yang siap diunduh
 */
export const generateStockReport = (stockData, params, storeProfile) => {
  const doc = new jsPDF();
  
  // Header laporan
  const subtitle = `Periode: ${params.startDate} - ${params.endDate}`;
  addReportHeader(doc, 'LAPORAN STOK BARANG', subtitle, storeProfile);
  
  // Tabel data stok
  const tableColumn = ['No', 'Kode', 'Nama Barang', 'Kategori', 'Stok Awal', 'Masuk', 'Keluar', 'Stok Akhir', 'Satuan', 'Nilai (Rp)'];
  const tableRows = [];
  
  stockData.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.code,
      item.name,
      item.category,
      item.initialStock,
      item.stockIn,
      item.stockOut,
      item.finalStock,
      item.unit,
      item.value.toLocaleString('id-ID')
    ];
    tableRows.push(rowData);
  });
  
  // Tambahkan total nilai stok
  const totalValue = stockData.reduce((sum, item) => sum + item.value, 0);
  tableRows.push([
    '', '', '', '', '', '', '', '', 'Total Nilai',
    totalValue.toLocaleString('id-ID')
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Footer laporan
  addReportFooter(doc);
  
  return doc;
};

/**
 * Fungsi untuk membuat laporan absensi
 * @param {array} attendanceData - Data absensi
 * @param {object} params - Parameter laporan (periode, dll)
 * @param {object} storeProfile - Informasi toko
 * @returns {jsPDF} - Objek PDF yang siap diunduh
 */
export const generateAttendanceReport = (attendanceData, params, storeProfile) => {
  const doc = new jsPDF();
  
  // Header laporan
  const subtitle = `Periode: ${params.startDate} - ${params.endDate}`;
  addReportHeader(doc, 'LAPORAN ABSENSI KARYAWAN', subtitle, storeProfile);
  
  // Tabel data absensi
  const tableColumn = ['No', 'ID', 'Nama', 'Jabatan', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status', 'Keterangan'];
  const tableRows = [];
  
  attendanceData.forEach((record, index) => {
    const rowData = [
      index + 1,
      record.employeeId,
      record.employeeName,
      record.position,
      new Date(record.date).toLocaleDateString('id-ID'),
      record.checkInTime || '-',
      record.checkOutTime || '-',
      record.status,
      record.notes || '-'
    ];
    tableRows.push(rowData);
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Ringkasan absensi
  const presentCount = attendanceData.filter(record => record.status === 'Hadir').length;
  const absentCount = attendanceData.filter(record => record.status === 'Tidak Hadir').length;
  const lateCount = attendanceData.filter(record => record.status === 'Terlambat').length;
  
  const summaryY = doc.autoTable.previous.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Absensi', 14, summaryY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Karyawan: ${attendanceData.length}`, 14, summaryY + 7);
  doc.text(`Hadir: ${presentCount}`, 14, summaryY + 14);
  doc.text(`Tidak Hadir: ${absentCount}`, 14, summaryY + 21);
  doc.text(`Terlambat: ${lateCount}`, 14, summaryY + 28);
  
  // Footer laporan
  addReportFooter(doc);
  
  return doc;
};

/**
 * Fungsi untuk memvalidasi data laporan sebelum membuat PDF
 * @param {array} data - Data laporan
 * @param {string} reportType - Jenis laporan
 */
const validateReportData = (data, reportType) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Data untuk laporan ${reportType} tidak valid atau kosong.`);
  }
};

/**
 * Fungsi untuk membuat laporan bulanan dengan data yang lebih rinci
 * @param {object} reportData - Data laporan bulanan
 * @param {object} params - Parameter laporan (bulan, tahun)
 * @param {object} storeProfile - Informasi toko
 * @returns {jsPDF} - Objek PDF yang siap diunduh
 */
export const generateMonthlyReport = (reportData, params, storeProfile) => {
  validateReportData(reportData, 'bulanan');

  const doc = new jsPDF();

  // Header laporan
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const subtitle = `Bulan: ${monthNames[params.month - 1]} ${params.year}`;
  addReportHeader(doc, 'LAPORAN BULANAN', subtitle, storeProfile);

  // Tabel data laporan bulanan
  const tableColumn = ['No', 'Item Terlaris', 'Total Penjualan (Rp)', 'Total Transaksi'];
  const tableRows = reportData.map((item, index) => [
    index + 1,
    item.bestSellingItem,
    item.totalSales.toLocaleString('id-ID'),
    item.totalTransactions
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 60,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer laporan
  addReportFooter(doc);

  return doc;
};

/**
 * Fungsi untuk membuat laporan tahunan
 * @param {object} reportData - Data laporan tahunan
 * @param {object} params - Parameter laporan (tahun)
 * @param {object} storeProfile - Informasi toko
 * @returns {jsPDF} - Objek PDF yang siap diunduh
 */
export const generateYearlyReport = (reportData, params, storeProfile) => {
  const doc = new jsPDF();
  
  // Header laporan
  const subtitle = `Tahun: ${params.year}`;
  addReportHeader(doc, 'LAPORAN TAHUNAN', subtitle, storeProfile);
  
  // Implementasikan sesuai kebutuhan laporan tahunan
  // ...
  
  // Footer laporan
  addReportFooter(doc);
  
  return doc;
};

/**
 * Fungsi utama untuk menghasilkan PDF berdasarkan jenis laporan
 * @param {string} reportType - Jenis laporan (stock, attendance, monthly, yearly)
 * @param {object} reportData - Data laporan
 * @param {object} params - Parameter laporan
 * @param {object} storeProfile - Informasi toko
 * @returns {jsPDF} - Objek PDF yang siap diunduh
 */
export const generatePdf = (reportType, reportData, params, storeProfile) => {
  switch (reportType) {
    case 'stock':
      return generateStockReport(reportData, params, storeProfile);
    case 'attendance':
      return generateAttendanceReport(reportData, params, storeProfile);
    case 'monthly':
      return generateMonthlyReport(reportData, params, storeProfile);
    case 'yearly':
      return generateYearlyReport(reportData, params, storeProfile);
    default:
      throw new Error('Jenis laporan tidak valid');
  }
};

/**
 * Fungsi untuk mengunduh PDF
 * @param {jsPDF} doc - Objek PDF
 * @param {string} filename - Nama file PDF
 */
export const downloadPdf = (doc, filename) => {
  doc.save(filename);
};

export default {
  generatePdf,
  downloadPdf
};
