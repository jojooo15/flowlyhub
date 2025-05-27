import { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import './App.css';

/**
 * INSTRUKSI UNTUK BACKEND DEVELOPER:
 *
 * Aplikasi ini menggunakan React Context API untuk manajemen state.
 *
 * 1. Semua interaksi dengan API dilakukan melalui AppContext
 * 2. Fungsi-fungsi API didefinisikan di src/context/AppContext.jsx
 * 3. Implementasi API ada di src/services/api.js
 *
 * Untuk menghubungkan dengan backend:
 * 1. Ubah USE_MOCK_API menjadi false di src/config.js
 * 2. Sesuaikan API_BASE_URL dengan URL backend yang sebenarnya
 * 3. Pastikan endpoint API backend sesuai dengan yang diharapkan frontend
 */

function App() {
  const [activeFeature, setActiveFeature] = useState('dashboard');
  const {
    isLoading,
    error,
    fetchStockItems,
    setError
    // fetchStoreProfile // Dinonaktifkan sementara
  } = useAppContext();

  // Mengambil data saat aplikasi dimuat
  useEffect(() => {
    fetchStockItems();
    // fetchStoreProfile(); // Dinonaktifkan sementara untuk menghindari error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Memuat data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Tutup</button>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      )}

      <header className="app-header">
        <h1>FlowlyHub</h1>
        <p>Smart Management System for Local Businesses</p>
      </header>
      <main className="app-content">
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
          </div>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Stok Barang</h3>
              <p className="amount">152</p>
            </div>
            <div className="summary-card">
              <h3>Karyawan Hadir</h3>
              <p className="amount">8/10</p>
            </div>
            <div className="summary-card">
              <h3>Transaksi Bulan Ini</h3>
              <p className="amount">87</p>
            </div>
            <div className="summary-card">
              <h3>Barang Hampir Habis</h3>
              <p className="amount">5</p>
            </div>
          </div>
          <div className="menu-grid">
            <div
              className={`menu-item ${activeFeature === 'stock' ? 'active' : ''}`}
              style={{ backgroundColor: '#4CAF50' }}
              onClick={() => handleFeatureClick('stock')}
            >
              <div className="menu-icon">📦</div>
              <div className="menu-label">Stok Barang</div>
            </div>
            <div
              className={`menu-item ${activeFeature === 'attendance' ? 'active' : ''}`}
              style={{ backgroundColor: '#2196F3' }}
              onClick={() => handleFeatureClick('attendance')}
            >
              <div className="menu-icon">👥</div>
              <div className="menu-label">Absensi</div>
            </div>
            <div
              className={`menu-item ${activeFeature === 'history' ? 'active' : ''}`}
              style={{ backgroundColor: '#FF9800' }}
              onClick={() => handleFeatureClick('history')}
            >
              <div className="menu-icon">📜</div>
              <div className="menu-label">Riwayat</div>
            </div>
            <div
              className={`menu-item ${activeFeature === 'reports' ? 'active' : ''}`}
              style={{ backgroundColor: '#E91E63' }}
              onClick={() => handleFeatureClick('reports')}
            >
              <div className="menu-icon">📊</div>
              <div className="menu-label">Laporan</div>
            </div>
            <div
              className={`menu-item ${activeFeature === 'settings' ? 'active' : ''}`}
              style={{ backgroundColor: '#607D8B' }}
              onClick={() => handleFeatureClick('settings')}
            >
              <div className="menu-icon">⚙️</div>
              <div className="menu-label">Pengaturan</div>
            </div>
          </div>

          {activeFeature === 'dashboard' && (
            <div className="recent-activities">
              <h2>Aktivitas Terbaru</h2>
              <div className="activity-list">
                <table>
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>Aktivitas</th>
                      <th>Pengguna</th>
                      <th>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>21 Mei 2025 08:30</td>
                      <td>Absensi Masuk</td>
                      <td>Budi</td>
                      <td>Tepat waktu</td>
                    </tr>
                    <tr>
                      <td>21 Mei 2025 09:15</td>
                      <td>Penambahan Stok</td>
                      <td>Ani</td>
                      <td>Beras +50kg</td>
                    </tr>
                    <tr>
                      <td>20 Mei 2025 16:45</td>
                      <td>Absensi Keluar</td>
                      <td>Citra</td>
                      <td>Tepat waktu</td>
                    </tr>
                    <tr>
                      <td>20 Mei 2025 14:20</td>
                      <td>Cetak Laporan</td>
                      <td>Dodi</td>
                      <td>Laporan Bulanan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeFeature === 'stock' && (
            <div className="feature-content">
              <h2>Manajemen Stok Barang</h2>
              <div className="stock-controls">
                <button className="action-button">Tambah Barang</button>
                <button className="action-button">Perbarui Stok</button>
                <div className="search-bar">
                  <input type="text" placeholder="Cari barang..." />
                  <button>Cari</button>
                </div>
              </div>
              <div className="stock-table">
                <table>
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Stok</th>
                      <th>Satuan</th>
                      <th>Harga</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>BRG001</td>
                      <td>Beras</td>
                      <td>Bahan Pokok</td>
                      <td>250</td>
                      <td>kg</td>
                      <td>Rp 12.500</td>
                      <td><span className="status-normal">Normal</span></td>
                      <td>
                        <button className="small-button edit">Edit</button>
                        <button className="small-button delete">Hapus</button>
                      </td>
                    </tr>
                    <tr>
                      <td>BRG002</td>
                      <td>Gula</td>
                      <td>Bahan Pokok</td>
                      <td>75</td>
                      <td>kg</td>
                      <td>Rp 15.000</td>
                      <td><span className="status-normal">Normal</span></td>
                      <td>
                        <button className="small-button edit">Edit</button>
                        <button className="small-button delete">Hapus</button>
                      </td>
                    </tr>
                    <tr>
                      <td>BRG003</td>
                      <td>Minyak Goreng</td>
                      <td>Bahan Pokok</td>
                      <td>15</td>
                      <td>liter</td>
                      <td>Rp 20.000</td>
                      <td><span className="status-warning">Hampir Habis</span></td>
                      <td>
                        <button className="small-button edit">Edit</button>
                        <button className="small-button delete">Hapus</button>
                      </td>
                    </tr>
                    <tr>
                      <td>BRG004</td>
                      <td>Telur</td>
                      <td>Bahan Pokok</td>
                      <td>8</td>
                      <td>kg</td>
                      <td>Rp 28.000</td>
                      <td><span className="status-warning">Hampir Habis</span></td>
                      <td>
                        <button className="small-button edit">Edit</button>
                        <button className="small-button delete">Hapus</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeFeature === 'attendance' && (
            <div className="feature-content">
              <h2>Absensi Karyawan</h2>
              <div className="attendance-controls">
                <div className="date-picker">
                  <label>Tanggal: </label>
                  <input type="date" defaultValue="2024-05-21" />
                </div>
                <div className="weather-select">
                  <label>Cuaca: </label>
                  <select>
                    <option value="Hujan">Hujan</option>
                    <option value="Berawan">Berawan</option>
                    <option value="Cerah">Cerah</option>
                  </select>
                </div>
                <button className="action-button">Rekam Absensi</button>
                <button className="action-button">Rekap Absensi</button>
              </div>
              <div className="attendance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>ID Karyawan</th>
                      <th>Nama</th>
                      <th>Jam Masuk</th>
                      <th>Jam Jadwal</th>
                      <th>Terlambat</th>
                      <th>Cuaca</th>
                      <th>Hari</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>21-05-24</td>
                      <td>9</td>
                      <td>Karyawan_9</td>
                      <td>8:34</td>
                      <td>8:00</td>
                      <td><span className="status-late">Ya</span></td>
                      <td>Hujan</td>
                      <td>Tuesday</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>01-04-24</td>
                      <td>12</td>
                      <td>Karyawan_12</td>
                      <td>8:41</td>
                      <td>8:00</td>
                      <td><span className="status-late">Ya</span></td>
                      <td>Berawan</td>
                      <td>Monday</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>24-06-24</td>
                      <td>8</td>
                      <td>Karyawan_8</td>
                      <td>8:06</td>
                      <td>8:00</td>
                      <td><span className="status-late">Ya</span></td>
                      <td>Cerah</td>
                      <td>Monday</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>02-03-24</td>
                      <td>11</td>
                      <td>Karyawan_11</td>
                      <td>7:56</td>
                      <td>8:00</td>
                      <td><span className="status-ontime">Tidak</span></td>
                      <td>Hujan</td>
                      <td>Saturday</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="attendance-stats">
                <h3>Statistik Keterlambatan Berdasarkan Cuaca</h3>
                <div className="stats-cards">
                  <div className="stats-card">
                    <h4>Hujan</h4>
                    <p>Total: <strong>15</strong> hari</p>
                    <p>Terlambat: <strong>10</strong> kali (67%)</p>
                  </div>
                  <div className="stats-card">
                    <h4>Berawan</h4>
                    <p>Total: <strong>8</strong> hari</p>
                    <p>Terlambat: <strong>4</strong> kali (50%)</p>
                  </div>
                  <div className="stats-card">
                    <h4>Cerah</h4>
                    <p>Total: <strong>7</strong> hari</p>
                    <p>Terlambat: <strong>2</strong> kali (29%)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'history' && (
            <div className="feature-content">
              <h2>Riwayat Aktivitas</h2>
              <div className="history-controls">
                <div className="filter-group">
                  <label>Dari: </label>
                  <input type="date" defaultValue="2025-05-01" />
                  <label>Sampai: </label>
                  <input type="date" defaultValue="2025-05-21" />
                </div>
                <div className="filter-group">
                  <label>Jenis: </label>
                  <select>
                    <option value="all">Semua Aktivitas</option>
                    <option value="stock">Stok Barang</option>
                    <option value="attendance">Absensi</option>
                    <option value="report">Laporan</option>
                  </select>
                </div>
                <button className="action-button">Filter</button>
              </div>
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal & Waktu</th>
                      <th>Jenis Aktivitas</th>
                      <th>Pengguna</th>
                      <th>Detail</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>21 Mei 2025 08:30</td>
                      <td>Absensi</td>
                      <td>Budi Santoso</td>
                      <td>Check-in</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>21 Mei 2025 09:15</td>
                      <td>Stok Barang</td>
                      <td>Ani Wijaya</td>
                      <td>Penambahan stok beras (50kg)</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>20 Mei 2025 16:45</td>
                      <td>Absensi</td>
                      <td>Citra Dewi</td>
                      <td>Check-out</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                    <tr>
                      <td>20 Mei 2025 14:20</td>
                      <td>Laporan</td>
                      <td>Dodi Pratama</td>
                      <td>Cetak laporan bulanan</td>
                      <td>
                        <button className="small-button">Detail</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeFeature === 'reports' && (
            <div className="feature-content">
              <h2>Laporan</h2>
              <div className="reports-controls">
                <div className="report-type">
                  <label>Jenis Laporan: </label>
                  <select>
                    <option value="stock">Laporan Stok Barang</option>
                    <option value="attendance">Laporan Absensi</option>
                    <option value="monthly">Laporan Bulanan</option>
                    <option value="yearly">Laporan Tahunan</option>
                  </select>
                </div>
                <div className="date-range">
                  <label>Periode: </label>
                  <input type="date" defaultValue="2025-05-01" />
                  <span>hingga</span>
                  <input type="date" defaultValue="2025-05-21" />
                </div>
                <div className="report-actions">
                  <button className="action-button">Lihat Laporan</button>
                  <button className="action-button print">Cetak PDF</button>
                </div>
              </div>
              <div className="report-preview">
                <div className="report-header">
                  <h3>Laporan Stok Barang</h3>
                  <p>Periode: 1 Mei 2025 - 21 Mei 2025</p>
                </div>
                <div className="report-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Nama Barang</th>
                        <th>Stok Awal</th>
                        <th>Masuk</th>
                        <th>Keluar</th>
                        <th>Stok Akhir</th>
                        <th>Satuan</th>
                        <th>Nilai (Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>BRG001</td>
                        <td>Beras</td>
                        <td>200</td>
                        <td>+50</td>
                        <td>0</td>
                        <td>250</td>
                        <td>kg</td>
                        <td>3.125.000</td>
                      </tr>
                      <tr>
                        <td>BRG002</td>
                        <td>Gula</td>
                        <td>100</td>
                        <td>0</td>
                        <td>-25</td>
                        <td>75</td>
                        <td>kg</td>
                        <td>1.125.000</td>
                      </tr>
                      <tr>
                        <td>BRG003</td>
                        <td>Minyak Goreng</td>
                        <td>30</td>
                        <td>0</td>
                        <td>-15</td>
                        <td>15</td>
                        <td>liter</td>
                        <td>300.000</td>
                      </tr>
                      <tr>
                        <td>BRG004</td>
                        <td>Telur</td>
                        <td>20</td>
                        <td>0</td>
                        <td>-12</td>
                        <td>8</td>
                        <td>kg</td>
                        <td>224.000</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="7" className="total-label">Total Nilai Stok</td>
                        <td className="total-value">4.774.000</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'settings' && (
            <div className="feature-content">
              <h2>Pengaturan</h2>
              <div className="settings-container">
                <div className="settings-sidebar">
                  <ul>
                    <li className="active">Profil Toko</li>
                    <li>Pengguna</li>
                    <li>Notifikasi</li>
                    <li>Backup Data</li>
                    <li>Tema Aplikasi</li>
                  </ul>
                </div>
                <div className="settings-content">
                  <h3>Profil Toko</h3>
                  <form className="settings-form">
                    <div className="form-group">
                      <label>Nama Toko</label>
                      <input type="text" defaultValue="Toko Sejahtera" />
                    </div>
                    <div className="form-group">
                      <label>Alamat</label>
                      <textarea defaultValue="Jl. Pahlawan No. 123, Jakarta"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Telepon</label>
                      <input type="text" defaultValue="021-12345678" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue="info@tokosejahtera.com" />
                    </div>
                    <div className="form-group">
                      <label>Logo Toko</label>
                      <div className="logo-upload">
                        <div className="logo-preview">
                          <span>Preview Logo</span>
                        </div>
                        <input type="file" />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="action-button">Simpan Perubahan</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
