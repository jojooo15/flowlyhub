/* eslint-env browser */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CustomDatePicker from '../components/CustomDatePicker';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import '../styles/Dashboard_New.css';

const Dashboard = () => {  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        api.stock.getAll(),
        api.attendance.getStats(),
        api.reports.getCsvFinancial({ 
          startDate: selectedDate.toISOString().split('T')[0],
          endDate: selectedDate.toISOString().split('T')[0]
        })
      ]);

      // Extract data from settled promises, providing fallbacks
      const stockResponse = results[0].status === 'fulfilled' 
        ? results[0].value
        : { data: { stocks: [] } };
      
      const stockData = stockResponse.data?.stocks || [];
      
      const attendanceData = results[1].status === 'fulfilled' 
        ? results[1].value.data 
        : { summary: { totalRecords: 0, onTimeRecords: 0 } };
      
      const financialData = results[2].status === 'fulfilled' 
        ? results[2].value.data
        : { summary: { totalRevenue: 0, totalTransactions: 0 } };

      // Calculate stock metrics from database data
      const totalProducts = stockData.length || 0;
      const totalSales = stockData.reduce((sum, item) => sum + (item.stok_keluar || 0), 0);
      const totalRevenue = stockData.reduce((sum, item) => sum + (item.nilai || 0), 0);
      
      // Calculate low stock items
      const lowStockItems = stockData.filter(item => item.stok_akhir <= 10);

      setDashboardData({
        totalStock: totalProducts,
        employeesPresent: `${attendanceData.summary?.onTimeRecords || 0}/${attendanceData.summary?.totalRecords || 0}`,
        transactions: financialData.summary?.totalTransactions || totalSales,
        itemsLow: lowStockItems.length,
        totalValue: totalRevenue,
        todaysSales: financialData.summary?.totalRevenue || totalRevenue
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data dashboard. Pastikan backend server berjalan.');
      setDashboardData({
        totalStock: 0,
        employeesPresent: '0/0',
        transactions: 0,
        itemsLow: 0,
        totalValue: 0,
        todaysSales: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  
  const summaryData = dashboardData || {
    totalStock: 0,
    employeesPresent: '0/0',
    transactions: 0,
    itemsLow: 0,
    totalValue: 0,
    todaysSales: 0
  };

  const recentActivities = [
    { timestamp: '21 Mei 2025 08:30', type: 'Absensi Masuk', user: 'Budi', detail: 'Tepat Waktu', action: '' },
    { timestamp: '21 Mei 2025 08:30', type: 'Penambahan Stok', user: 'Ani', detail: 'Beras +50kg', action: '' },
    { timestamp: '21 Mei 2025 08:30', type: 'Absensi Keluar', user: 'Dedi', detail: 'Tepat waktu', action: '' },
    { timestamp: '21 Mei 2025 08:30', type: 'Cetak Laporan', user: 'Mulyani', detail: 'Laporan Bulanan', action: '' },
    { timestamp: '21 Mei 2025 08:30', type: 'Absensi Masuk', user: 'Doni', detail: 'Tepat waktu', action: '' }
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Tutup</button>
        </div>
      </div>
    );
  }  return (
    <div className="dashboard">
      <Header title="Dashboard" />
      <div className="dashboard-content">        <div className="date-filter-section">
          <CustomDatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            placeholderText="Pilih tanggal"
          />
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Stok Barang</h3>
            <p className="amount">{summaryData.totalStock}</p>
          </div>
          <div className="summary-card">
            <h3>Karyawan Hadir</h3>
            <p className="amount">{summaryData.employeesPresent}</p>
          </div>
          <div className="summary-card">
            <h3>Transaksi Bulan Ini</h3>
            <p className="amount">{summaryData.transactions}</p>
          </div>
          <div className="summary-card">
            <h3>Barang Hampir Habis</h3>
            <p className="amount">{summaryData.itemsLow}</p>
          </div>
        </div>

        <div className="recent-activities">
          <h2>Aktivitas Terbaru</h2>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">{activity.timestamp}</div>
                <div className="activity-type">{activity.type}</div>
                <div className="activity-user">{activity.user}</div>
                <div className="activity-detail">{activity.detail}</div>
              </div>
            ))}          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
