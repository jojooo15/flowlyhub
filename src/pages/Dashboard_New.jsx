import React, { useState, useEffect } from 'react';
import CustomDatePicker from '../components/CustomDatePicker';
import AIAnalytics from '../components/AIAnalytics';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchDashboardData function before useEffect
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled([
        api.stock.getAll(),
        api.attendance.getTodayStatus(),
        api.transactions.getDailyReport(selectedDate.toISOString().split('T')[0])
      ]);

      // Extract data from settled promises, providing fallbacks
      const stockData = results[0].status === 'fulfilled' 
        ? (results[0].value.data?.stocks || results[0].value.data || [])
        : [];
      
      const attendanceData = results[1].status === 'fulfilled' 
        ? results[1].value.data 
        : { hasClockIn: false };
      
      const transactionsData = results[2].status === 'fulfilled' 
        ? results[2].value.data 
        : { sales: { count: 0, totalAmount: 0 } };

      const lowStockItems = Array.isArray(stockData) 
        ? stockData.filter(item => item && item.stok_akhir <= 10)
        : [];

      setDashboardData({
        totalStock: Array.isArray(stockData) ? stockData.length : 0,
        employeesPresent: attendanceData?.hasClockIn ? '1/1' : '0/1',
        transactions: transactionsData?.sales?.count || 0,
        itemsLow: lowStockItems.length,
        totalValue: Array.isArray(stockData) 
          ? stockData.reduce((sum, item) => sum + (item?.nilai || 0), 0)
          : 0,
        todaysSales: transactionsData?.sales?.totalAmount || 0
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set fallback data
      setDashboardData({
        totalStock: 152,
        employeesPresent: '8/10',
        transactions: 87,
        itemsLow: 5,
        totalValue: 25000000,
        todaysSales: 1500000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="date-filter">
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
          ))}
        </div>
      </div>

      <AIAnalytics />
    </div>
  );
};

export default Dashboard;
