import React, { useState, useEffect } from 'react';
import { FaSave, FaStore, FaUser, FaPrint, FaBell, FaLanguage, FaDatabase } from 'react-icons/fa';
import Header from '../components/Header';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/Settings.css';

const Settings = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('store');
  const [storeSettings, setStoreSettings] = useState({
    name: 'Warung Barokah',
    address: 'Jl. Pahlawan No. 123, Jakarta',
    phone: '081234567890',
    email: 'warungbarokah@example.com',
    taxId: '12.345.678.9-012.000',
    logo: null
  });

  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '********',
    newPassword: '',
    confirmPassword: ''
  });

  // Update userSettings when user data is available
  useEffect(() => {
    if (user) {
      setUserSettings(prev => ({
        ...prev,
        name: user.nama || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role === 'admin' ? 'Administrator' : 
              user.role === 'manager' ? 'Manager' : 
              user.role === 'employee' ? 'Employee' : 'Owner'
      }));
    }
  }, [user]);

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showAddress: true,
    showPhone: true,
    showEmail: false,
    showTaxId: false,
    footerText: 'Terima kasih atas kunjungan Anda!',
    paperSize: 'small',
    printCopies: 1
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    lowStockThreshold: 10,
    dailySalesSummary: true,
    newOrderNotification: true,
    emailNotifications: false
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = window.URL.createObjectURL(file);
      setStoreSettings(prev => ({
        ...prev,
        logo: fileUrl
      }));
    }
  };

  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value
    });
  };

  const handleReceiptSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReceiptSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    window.alert('Pengaturan berhasil disimpan!');
  };

  // Fungsi untuk backup data
  const handleBackupData = async () => {
    try {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm('Apakah Anda yakin ingin membuat backup data?');
      if (confirmed) {
        // Simulasi backup data
        const backupData = {
          timestamp: new Date().toISOString(),
          storeSettings,
          userSettings: { ...userSettings, password: undefined }, // Jangan backup password
          receiptSettings,
          notificationSettings
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // eslint-disable-next-line no-alert
        alert('Backup data berhasil diunduh!');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating backup:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal membuat backup data.');
    }
  };

  // Fungsi untuk restore data
  const handleRestoreData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const backupData = JSON.parse(event.target.result);
            
            // eslint-disable-next-line no-alert
            const confirmed = window.confirm('Apakah Anda yakin ingin restore data? Data saat ini akan diganti.');
            
            if (confirmed) {
              if (backupData.storeSettings) setStoreSettings(backupData.storeSettings);
              if (backupData.receiptSettings) setReceiptSettings(backupData.receiptSettings);
              if (backupData.notificationSettings) setNotificationSettings(backupData.notificationSettings);
              
              // eslint-disable-next-line no-alert
              alert('Data berhasil di-restore!');
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error restoring data:', error);
            // eslint-disable-next-line no-alert
            alert('File backup tidak valid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Fungsi untuk export data
  const handleExportData = async () => {
    try {
      const { exportToExcel } = await import('../utils/excelGenerator');
      
      // Simulasi data untuk export
      const dataToExport = [
        { Kategori: 'Pengaturan Toko', Item: 'Nama Toko', Nilai: storeSettings.name },
        { Kategori: 'Pengaturan Toko', Item: 'Alamat', Nilai: storeSettings.address },
        { Kategori: 'Pengaturan Toko', Item: 'Telepon', Nilai: storeSettings.phone },
        { Kategori: 'Pengaturan User', Item: 'Nama User', Nilai: userSettings.name },
        { Kategori: 'Pengaturan User', Item: 'Email', Nilai: userSettings.email },
        { Kategori: 'Notifikasi', Item: 'Alert Stok Rendah', Nilai: notificationSettings.lowStockAlert ? 'Ya' : 'Tidak' },
        { Kategori: 'Notifikasi', Item: 'Batas Stok Rendah', Nilai: notificationSettings.lowStockThreshold },
      ];

      exportToExcel(dataToExport, `Settings_Export_${new Date().toISOString().split('T')[0]}.xlsx`, 'Pengaturan');
      // eslint-disable-next-line no-alert
      alert('Data pengaturan berhasil di-export!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error exporting data:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal export data.');
    }
  };

  // Fungsi untuk hapus data
  const handleDeleteAllData = () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat dibatalkan!');
    
    if (confirmed) {
      // eslint-disable-next-line no-alert
      const doubleConfirm = window.confirm('Konfirmasi sekali lagi: Ini akan menghapus SEMUA data toko. Ketik "HAPUS" untuk melanjutkan.');
      
      if (doubleConfirm) {
        // Reset semua settings ke default
        setStoreSettings({
          name: 'Nama Toko',
          address: '',
          phone: '',
          email: '',
          taxId: '',
          logo: null
        });
        
        setReceiptSettings({
          showLogo: true,
          showAddress: true,
          showPhone: true,
          showEmail: false,
          showTaxId: false,
          footerText: 'Terima kasih atas kunjungan Anda!',
          paperSize: 'small',
          printCopies: 1
        });
        
        setNotificationSettings({
          lowStockAlert: true,
          lowStockThreshold: 10,
          dailySalesSummary: true,
          newOrderNotification: true,
          emailNotifications: false
        });

        // eslint-disable-next-line no-alert
        alert('Semua data telah dihapus dan direset ke pengaturan default.');
      }
    }
  };

  return (
    <div className="settings-page">
      <Header title="Pengaturan" />
      
      <div className="settings-header">
        <h1>Pengaturan</h1>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => handleTabChange('store')}
          >
            <FaStore /> Toko
          </button>
          <button 
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => handleTabChange('user')}
          >
            <FaUser /> Profil
          </button>
          <button 
            className={`tab-button ${activeTab === 'receipt' ? 'active' : ''}`}
            onClick={() => handleTabChange('receipt')}
          >
            <FaPrint /> Struk
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            <FaBell /> Notifikasi
          </button>
          <button 
            className={`tab-button ${activeTab === 'language' ? 'active' : ''}`}
            onClick={() => handleTabChange('language')}
          >
            <FaLanguage /> Bahasa
          </button>
          <button 
            className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => handleTabChange('data')}
          >
            <FaDatabase /> Data
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'store' && (
            <form onSubmit={handleSubmit} className="settings-form">
              <h2>Pengaturan Toko</h2>
              
              <div className="form-group">
                <label>Logo Toko</label>
                <div className="logo-upload">
                  {storeSettings.logo ? (
                    <img src={storeSettings.logo} alt="Logo Toko" className="store-logo" />
                  ) : (
                    <div className="logo-placeholder">
                      <FaStore />
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="logo" 
                    accept="image/*" 
                    onChange={handleLogoChange} 
                  />
                  <label htmlFor="logo" className="upload-button">Pilih Logo</label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Nama Toko</label>
                <input 
                  type="text" 
                  name="name" 
                  value={storeSettings.name} 
                  onChange={handleStoreSettingsChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Alamat</label>
                <textarea 
                  name="address" 
                  value={storeSettings.address} 
                  onChange={handleStoreSettingsChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={storeSettings.phone} 
                  onChange={handleStoreSettingsChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={storeSettings.email} 
                  onChange={handleStoreSettingsChange} 
                />
              </div>
              
              <div className="form-group">
                <label>NPWP</label>
                <input 
                  type="text" 
                  name="taxId" 
                  value={storeSettings.taxId} 
                  onChange={handleStoreSettingsChange} 
                />
              </div>
              
              <button type="submit" className="save-button">
                <FaSave /> Simpan Pengaturan
              </button>
            </form>
          )}

          {activeTab === 'user' && (
            <form onSubmit={handleSubmit} className="settings-form">
              <h2>Pengaturan Profil</h2>
              
              <div className="form-group">
                <label>Nama</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userSettings.name} 
                  onChange={handleUserSettingsChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userSettings.email} 
                  onChange={handleUserSettingsChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={userSettings.phone} 
                  onChange={handleUserSettingsChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Peran</label>
                <input 
                  type="text" 
                  name="role" 
                  value={userSettings.role} 
                  onChange={handleUserSettingsChange} 
                  disabled 
                />
              </div>
              
              <h3>Ubah Password</h3>
              
              <div className="form-group">
                <label>Password Saat Ini</label>
                <input 
                  type="password" 
                  name="password" 
                  value={userSettings.password} 
                  onChange={handleUserSettingsChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Password Baru</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={userSettings.newPassword} 
                  onChange={handleUserSettingsChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={userSettings.confirmPassword} 
                  onChange={handleUserSettingsChange} 
                />
              </div>
              
              <button type="submit" className="save-button">
                <FaSave /> Simpan Pengaturan
              </button>
            </form>
          )}

          {activeTab === 'receipt' && (
            <form onSubmit={handleSubmit} className="settings-form">
              <h2>Pengaturan Struk</h2>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="showLogo" 
                  name="showLogo" 
                  checked={receiptSettings.showLogo} 
                  onChange={handleReceiptSettingsChange} 
                />
                <label htmlFor="showLogo">Tampilkan Logo</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="showAddress" 
                  name="showAddress" 
                  checked={receiptSettings.showAddress} 
                  onChange={handleReceiptSettingsChange} 
                />
                <label htmlFor="showAddress">Tampilkan Alamat</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="showPhone" 
                  name="showPhone" 
                  checked={receiptSettings.showPhone} 
                  onChange={handleReceiptSettingsChange} 
                />
                <label htmlFor="showPhone">Tampilkan Nomor Telepon</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="showEmail" 
                  name="showEmail" 
                  checked={receiptSettings.showEmail} 
                  onChange={handleReceiptSettingsChange} 
                />
                <label htmlFor="showEmail">Tampilkan Email</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="showTaxId" 
                  name="showTaxId" 
                  checked={receiptSettings.showTaxId} 
                  onChange={handleReceiptSettingsChange} 
                />
                <label htmlFor="showTaxId">Tampilkan NPWP</label>
              </div>
              
              <div className="form-group">
                <label>Teks Footer</label>
                <textarea 
                  name="footerText" 
                  value={receiptSettings.footerText} 
                  onChange={handleReceiptSettingsChange} 
                />
              </div>
              
              <div className="form-group">
                <label>Ukuran Kertas</label>
                <select 
                  name="paperSize" 
                  value={receiptSettings.paperSize} 
                  onChange={handleReceiptSettingsChange}
                >
                  <option value="small">Kecil (58mm)</option>
                  <option value="medium">Sedang (80mm)</option>
                  <option value="large">Besar (A4)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Jumlah Salinan</label>
                <input 
                  type="number" 
                  name="printCopies" 
                  min="1" 
                  max="5" 
                  value={receiptSettings.printCopies} 
                  onChange={handleReceiptSettingsChange} 
                />
              </div>
              
              <button type="submit" className="save-button">
                <FaSave /> Simpan Pengaturan
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSubmit} className="settings-form">
              <h2>Pengaturan Notifikasi</h2>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="lowStockAlert" 
                  name="lowStockAlert" 
                  checked={notificationSettings.lowStockAlert} 
                  onChange={handleNotificationSettingsChange} 
                />
                <label htmlFor="lowStockAlert">Peringatan Stok Menipis</label>
              </div>
              
              <div className="form-group">
                <label>Batas Stok Menipis</label>
                <input 
                  type="number" 
                  name="lowStockThreshold" 
                  min="1" 
                  value={notificationSettings.lowStockThreshold} 
                  onChange={handleNotificationSettingsChange} 
                />
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="dailySalesSummary" 
                  name="dailySalesSummary" 
                  checked={notificationSettings.dailySalesSummary} 
                  onChange={handleNotificationSettingsChange} 
                />
                <label htmlFor="dailySalesSummary">Ringkasan Penjualan Harian</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="newOrderNotification" 
                  name="newOrderNotification" 
                  checked={notificationSettings.newOrderNotification} 
                  onChange={handleNotificationSettingsChange} 
                />
                <label htmlFor="newOrderNotification">Notifikasi Pesanan Baru</label>
              </div>
              
              <div className="form-group checkbox">
                <input 
                  type="checkbox" 
                  id="emailNotifications" 
                  name="emailNotifications" 
                  checked={notificationSettings.emailNotifications} 
                  onChange={handleNotificationSettingsChange} 
                />
                <label htmlFor="emailNotifications">Kirim Notifikasi ke Email</label>
              </div>
              
              <button type="submit" className="save-button">
                <FaSave /> Simpan Pengaturan
              </button>
            </form>
          )}

          {activeTab === 'language' && (
            <div className="settings-form">
              <h2>Pengaturan Bahasa</h2>
              
              <div className="language-options">
                <div className="language-option active">
                  <div className="language-flag">🇮🇩</div>
                  <div className="language-info">
                    <h3>Bahasa Indonesia</h3>
                    <p>Bahasa default</p>
                  </div>
                </div>
                
                <div className="language-option">
                  <div className="language-flag">🇬🇧</div>
                  <div className="language-info">
                    <h3>English</h3>
                    <p>Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-form">
              <h2>Manajemen Data</h2>
              
              <div className="data-management">
                <div className="data-action">
                  <h3>Backup Data</h3>
                  <p>Buat cadangan data toko Anda untuk mencegah kehilangan data.</p>
                  <button className="action-button" onClick={handleBackupData}>Backup Sekarang</button>
                </div>
                
                <div className="data-action">
                  <h3>Restore Data</h3>
                  <p>Pulihkan data dari file backup yang telah dibuat sebelumnya.</p>
                  <button className="action-button" onClick={handleRestoreData}>Restore Data</button>
                </div>
                
                <div className="data-action">
                  <h3>Export Data</h3>
                  <p>Export data transaksi, produk, atau laporan ke format Excel.</p>
                  <button className="action-button" onClick={handleExportData}>Export Data</button>
                </div>
                
                <div className="data-action warning">
                  <h3>Hapus Semua Data</h3>
                  <p>Hapus semua data toko. Tindakan ini tidak dapat dibatalkan!</p>
                  <button className="action-button danger" onClick={handleDeleteAllData}>Hapus Data</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
