import { useState } from 'react';
import { 
  FaBox, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaChartBar, 
  FaCog, 
  FaWarehouse,
  FaLock,
  FaCalendarAlt
} from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [storeInfo] = useState({
    name: 'Warung Barokah',
    owner: 'Budi Santoso',
    address: 'Jl. Pahlawan No. 123, Jakarta',
    phone: '081234567890'
  });

  const [summaryData] = useState({
    dailySales: 'Rp 1.250.000',
    monthlySales: 'Rp 32.500.000',
    totalProducts: 48,
    pendingOrders: 5
  });

  const menuItems = [
    { path: '/products', icon: <FaBox />, label: 'Produk', color: '#4CAF50' },
    { path: '/transactions', icon: <FaShoppingCart />, label: 'Transaksi', color: '#2196F3' },
    { path: '/reports', icon: <FaChartBar />, label: 'Laporan', color: '#FF9800' },
    { path: '/expenses', icon: <FaMoneyBillWave />, label: 'Pengeluaran', color: '#E91E63' },
    { path: '/inventory', icon: <FaWarehouse />, label: 'Stok', color: '#9C27B0' },
    { path: '/settings', icon: <FaCog />, label: 'Pengaturan', color: '#607D8B' },
    { path: '/security', icon: <FaLock />, label: 'Keamanan', color: '#795548' },
    { path: '/calendar', icon: <FaCalendarAlt />, label: 'Jadwal', color: '#00BCD4' },
  ];

  const recentTransactions = [
    { id: 1, customer: 'Ani', items: 3, total: 'Rp 75.000', date: '21 Mei 2025' },
    { id: 2, customer: 'Budi', items: 5, total: 'Rp 125.000', date: '21 Mei 2025' },
    { id: 3, customer: 'Citra', items: 2, total: 'Rp 45.000', date: '20 Mei 2025' },
    { id: 4, customer: 'Dodi', items: 7, total: 'Rp 180.000', date: '20 Mei 2025' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="store-info">
          <h1>{storeInfo.name}</h1>
          <p>{storeInfo.address}</p>
        </div>
        <div className="date-info">
          <p>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Penjualan Hari Ini</h3>
          <p className="amount">{summaryData.dailySales}</p>
        </div>
        <div className="summary-card">
          <h3>Penjualan Bulan Ini</h3>
          <p className="amount">{summaryData.monthlySales}</p>
        </div>
        <div className="summary-card">
          <h3>Total Produk</h3>
          <p className="amount">{summaryData.totalProducts}</p>
        </div>
        <div className="summary-card">
          <h3>Pesanan Tertunda</h3>
          <p className="amount">{summaryData.pendingOrders}</p>
        </div>
      </div>

      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="menu-item" 
            style={{ backgroundColor: item.color }}
            onClick={() => window.location.href = item.path}
          >
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="recent-transactions">
        <h2>Transaksi Terbaru</h2>
        <div className="transaction-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Pelanggan</th>
                <th>Item</th>
                <th>Total</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.customer}</td>
                  <td>{transaction.items}</td>
                  <td>{transaction.total}</td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
