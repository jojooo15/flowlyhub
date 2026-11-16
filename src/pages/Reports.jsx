import React, { useState, useEffect, useCallback } from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa';
import Header from '../components/Header';
import CustomDatePicker from '../components/CustomDatePicker';
import LoadingSpinner from '../components/LoadingSpinner';
import AddTransactionOverlay from '../components/AddTransactionOverlay';
import api from '../services/api';
import '../styles/Reports.css';

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('hari-ini');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const response = await api.reports.getTransactions({
        startDate: startDateStr,
        endDate: endDateStr
      });
      
      if (response.success) {
        setReportData(response.data);
        setTransactions(response.data.transactions || []);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Gagal memuat data laporan. Pastikan backend server berjalan.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    updateDateRange(selectedPeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Calculate summary data from actual transactions
  const summaryData = {
    totalSales: reportData?.summary?.income || transactions
      .filter(t => t.jenis_transaksi === 'Pemasukan')
      .reduce((sum, t) => sum + t.jumlah, 0),
    totalTransactions: transactions.length,
    netIncome: reportData?.summary?.netIncome || transactions
      .reduce((sum, t) => t.jenis_transaksi === 'Pemasukan' ? sum + t.jumlah : sum - t.jumlah, 0),
    topProduct: reportData?.topCategory || 'N/A'
  };

  const updateDateRange = (period) => {
    const today = new Date();
    console.log(today);
    
    switch (period) {
      case 'hari-ini': {
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);

        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        setStartDate(start);
        setEndDate(end);

        break;
      }
      case 'bulanan': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setStartDate(monthStart);
        setEndDate(monthEnd);
        break;
      }
      default: {
        setStartDate(today);
        setEndDate(today);
      }
    }
  };

  // Filter dan pencarian transaksi
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.kategori_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.jenis_transaksi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         transaction.jenis_transaksi.toLowerCase() === filterType.toLowerCase();
                         
    return matchesSearch && matchesFilter;
  });

  const handleDownloadPDF = () => {
    try {
      const storeProfile = {
        name: 'FlowlyHub Store',
        address: 'Jl. Contoh No. 123',
        phone: '0812-3456-7890'
      };

      const params = {
        startDate: startDate.toLocaleDateString('id-ID'),
        endDate: endDate.toLocaleDateString('id-ID')
      };

      // Import fungsi PDF generator
      import('../utils/pdfGenerator').then(({ generatePdf, downloadPdf }) => {
        const doc = generatePdf('stock', filteredTransactions, params, storeProfile);
        downloadPdf(doc, `Laporan_Transaksi_${new Date().toISOString().split('T')[0]}.pdf`);
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error loading PDF generator:', error);
        // eslint-disable-next-line no-alert
        alert('Gagal mengunduh PDF. Silakan coba lagi.');
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating PDF:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Import fungsi Excel generator
      import('../utils/excelGenerator').then(({ exportTransactionsToExcel }) => {
        exportTransactionsToExcel(filteredTransactions);
        // eslint-disable-next-line no-alert
        alert('File Excel berhasil diunduh!');
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error loading Excel generator:', error);
        // eslint-disable-next-line no-alert
        alert('Gagal mengunduh Excel. Silakan coba lagi.');
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error exporting to Excel:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal mengunduh Excel. Silakan coba lagi.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTransactionAdded = async (transaction) => {
    try {
      const response = await api.reports.createTransaction(transaction);
      
      if (response.success) {
        // Refresh data to get updated summary
        fetchReportData();
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="reports">
        <Header title="Laporan" />
        <div className="reports-content">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports">
        <Header title="Laporan" />
        <div className="reports-content">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Tutup</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reports">
      <Header title="Laporan" />
      <div className="reports-content">
        <div className="reports-header">
          <h1>Laporan</h1>
          <div className="header-actions">
            <button 
              className="add-button"
              onClick={() => setShowAddTransaction(true)}
            >
              <FaPlus /> Tambah Transaksi
            </button>
          </div>
        </div>

        <div className="filters">
          <div className="period-filter">
            <label>Pilih Periode</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="hari-ini">Hari ini</option>
              <option value="bulanan">Bulanan</option>
            </select>
          </div>
          <div className="date-range">
            {selectedPeriod === 'bulanan' ? (
              <div className="date-range-container">
                <CustomDatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  placeholderText="Tanggal Mulai"
                  maxDate={endDate}
                />
                <span>sampai</span>
                <CustomDatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  placeholderText="Tanggal Akhir"
                  minDate={startDate}
                />
              </div>
            ) : (
              <CustomDatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                placeholderText="Pilih tanggal"
              />
            )}
          </div>
        </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Semua Jenis</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Penjualan Hari Ini</h3>
          <p>Rp {summaryData.totalSales.toLocaleString('id-ID')}</p>
        </div>
        <div className="summary-card">
          <h3>Jumlah Transaksi</h3>
          <p>{summaryData.totalTransactions}</p>
        </div>
        <div className="summary-card">
          <h3>Pendapatan Bersih</h3>
          <p>Rp {summaryData.netIncome.toLocaleString('id-ID')}</p>
        </div>
        <div className="summary-card">
          <h3>Produk Terlaris</h3>
          <p>{summaryData.topProduct}</p>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jenis Transaksi</th>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.tanggal}</td>
                <td>{transaction.jenis_transaksi}</td>
                <td>{transaction.kategori_transaksi}</td>
                <td>Rp {transaction.jumlah.toLocaleString('id-ID')}</td>
                <td>{transaction.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <div className="report-actions">
          <button onClick={handleDownloadPDF} className="download-btn pdf">
            Unduh PDF
          </button>
          <button onClick={handleDownloadExcel} className="download-btn excel">
            Unduh Excel
          </button>
          <button onClick={handlePrint} className="download-btn print">
            Cetak
          </button>
        </div>

        <AddTransactionOverlay
          isOpen={showAddTransaction}
          onClose={() => setShowAddTransaction(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
    </div>
  );
};

export default Reports;
