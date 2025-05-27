import { useState } from 'react';
import { FaSave, FaStore, FaUser, FaPrint, FaBell, FaLanguage, FaDatabase } from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
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
    name: 'Budi Santoso',
    email: 'budi@example.com',
    phone: '081234567890',
    role: 'Owner',
    password: '********',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings({
      ...storeSettings,
      [name]: value
    });
  };

  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value
    });
  };

  const handleReceiptSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setReceiptSettings({
      ...receiptSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreSettings({
        ...storeSettings,
        logo: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the settings to a backend
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="settings-page">
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
                  <button className="action-button">Backup Sekarang</button>
                </div>
                
                <div className="data-action">
                  <h3>Restore Data</h3>
                  <p>Pulihkan data dari file backup yang telah dibuat sebelumnya.</p>
                  <button className="action-button">Restore Data</button>
                </div>
                
                <div className="data-action">
                  <h3>Export Data</h3>
                  <p>Export data transaksi, produk, atau laporan ke format Excel.</p>
                  <button className="action-button">Export Data</button>
                </div>
                
                <div className="data-action warning">
                  <h3>Hapus Semua Data</h3>
                  <p>Hapus semua data toko. Tindakan ini tidak dapat dibatalkan!</p>
                  <button className="action-button danger">Hapus Data</button>
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
