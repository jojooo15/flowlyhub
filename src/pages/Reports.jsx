import { useState } from 'react';
import { FaDownload, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import '../styles/Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-05-01',
    endDate: '2025-05-21'
  });

  const salesData = [
    { date: '2025-05-15', amount: 850000 },
    { date: '2025-05-16', amount: 920000 },
    { date: '2025-05-17', amount: 1250000 },
    { date: '2025-05-18', amount: 1100000 },
    { date: '2025-05-19', amount: 780000 },
    { date: '2025-05-20', amount: 950000 },
    { date: '2025-05-21', amount: 1250000 },
  ];

  const productSalesData = [
    { product: 'Nasi Goreng', quantity: 85, revenue: 1275000 },
    { product: 'Mie Goreng', quantity: 62, revenue: 744000 },
    { product: 'Ayam Goreng', quantity: 45, revenue: 810000 },
    { product: 'Soto Ayam', quantity: 38, revenue: 570000 },
    { product: 'Es Teh', quantity: 120, revenue: 600000 },
    { product: 'Es Jeruk', quantity: 95, revenue: 570000 },
    { product: 'Kopi', quantity: 78, revenue: 546000 },
  ];

  const expenseData = [
    { category: 'Bahan Baku', amount: 3500000 },
    { category: 'Gaji Karyawan', amount: 2000000 },
    { category: 'Sewa Tempat', amount: 1500000 },
    { category: 'Listrik & Air', amount: 800000 },
    { category: 'Transportasi', amount: 400000 },
    { category: 'Lain-lain', amount: 300000 },
  ];

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const totalSales = salesData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalSales - totalExpenses;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Laporan Keuangan</h1>
        <button className="download-button">
          <FaDownload /> Unduh Laporan
        </button>
      </div>

      <div className="report-filters">
        <div className="report-type-selector">
          <label>Jenis Laporan:</label>
          <select value={reportType} onChange={handleReportTypeChange}>
            <option value="sales">Laporan Penjualan</option>
            <option value="products">Laporan Produk</option>
            <option value="expenses">Laporan Pengeluaran</option>
            <option value="profit">Laporan Laba/Rugi</option>
          </select>
        </div>
        <div className="date-range-selector">
          <label>Periode:</label>
          <input 
            type="date" 
            name="startDate" 
            value={dateRange.startDate} 
            onChange={handleDateChange} 
          />
          <span>hingga</span>
          <input 
            type="date" 
            name="endDate" 
            value={dateRange.endDate} 
            onChange={handleDateChange} 
          />
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Penjualan</h3>
          <p className="amount">Rp {totalSales.toLocaleString('id-ID')}</p>
        </div>
        <div className="summary-card">
          <h3>Total Pengeluaran</h3>
          <p className="amount">Rp {totalExpenses.toLocaleString('id-ID')}</p>
        </div>
        <div className="summary-card">
          <h3>Laba Bersih</h3>
          <p className={`amount ${profit >= 0 ? 'profit' : 'loss'}`}>
            Rp {profit.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="report-content">
        {reportType === 'sales' && (
          <div className="sales-report">
            <div className="chart-container">
              <div className="chart-header">
                <h2><FaChartLine /> Grafik Penjualan Harian</h2>
              </div>
              <div className="chart-placeholder">
                {/* In a real app, this would be a chart component */}
                <div className="mock-chart">
                  {salesData.map((item, index) => (
                    <div 
                      key={index} 
                      className="chart-bar" 
                      style={{ 
                        height: `${(item.amount / 1500000) * 100}%`,
                        left: `${(index / salesData.length) * 100}%`
                      }}
                      title={`${new Date(item.date).toLocaleDateString('id-ID')}: Rp ${item.amount.toLocaleString('id-ID')}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="sales-table">
              <h3>Detail Penjualan Harian</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jumlah Transaksi</th>
                    <th>Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.date).toLocaleDateString('id-ID')}</td>
                      <td>{Math.floor(item.amount / 50000)}</td>
                      <td>Rp {item.amount.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'products' && (
          <div className="products-report">
            <div className="chart-container">
              <div className="chart-header">
                <h2><FaChartBar /> Penjualan per Produk</h2>
              </div>
              <div className="chart-placeholder">
                {/* In a real app, this would be a chart component */}
                <div className="mock-horizontal-chart">
                  {productSalesData.map((item, index) => (
                    <div key={index} className="chart-row">
                      <div className="chart-label">{item.product}</div>
                      <div 
                        className="chart-bar-horizontal" 
                        style={{ width: `${(item.quantity / 120) * 100}%` }}
                        title={`${item.quantity} item`}
                      ></div>
                      <div className="chart-value">{item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="products-table">
              <h3>Detail Penjualan Produk</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Jumlah Terjual</th>
                    <th>Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {productSalesData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>Rp {item.revenue.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'expenses' && (
          <div className="expenses-report">
            <div className="chart-container">
              <div className="chart-header">
                <h2><FaChartPie /> Distribusi Pengeluaran</h2>
              </div>
              <div className="chart-placeholder">
                {/* In a real app, this would be a pie chart component */}
                <div className="mock-pie-chart">
                  {expenseData.map((item, index) => (
                    <div 
                      key={index} 
                      className="pie-segment" 
                      style={{ 
                        transform: `rotate(${index * 60}deg)`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                      title={`${item.category}: Rp ${item.amount.toLocaleString('id-ID')}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="expenses-table">
              <h3>Detail Pengeluaran</h3>
              <table>
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th>Jumlah</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.category}</td>
                      <td>Rp {item.amount.toLocaleString('id-ID')}</td>
                      <td>{((item.amount / totalExpenses) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'profit' && (
          <div className="profit-report">
            <div className="profit-summary">
              <h2>Ringkasan Laba/Rugi</h2>
              <div className="profit-details">
                <div className="profit-item">
                  <span>Total Pendapatan:</span>
                  <span>Rp {totalSales.toLocaleString('id-ID')}</span>
                </div>
                <div className="profit-item">
                  <span>Total Pengeluaran:</span>
                  <span>Rp {totalExpenses.toLocaleString('id-ID')}</span>
                </div>
                <div className="profit-divider"></div>
                <div className="profit-item total">
                  <span>Laba Bersih:</span>
                  <span className={profit >= 0 ? 'profit' : 'loss'}>
                    Rp {profit.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="profit-item">
                  <span>Margin Keuntungan:</span>
                  <span>{((profit / totalSales) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
