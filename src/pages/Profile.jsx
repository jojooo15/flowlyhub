import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaStore,
  FaUpload,
  FaSave,
  FaClock,
  FaDatabase,
  FaDownload,
  FaFileExcel,
  FaTrash
} from 'react-icons/fa';
import Header from '../components/Header';
import CustomDatePicker from '../components/CustomDatePicker';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    photo: null,
    joinDate: new Date(2023, 0, 1),
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update userProfile when user data is available
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.nama || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        position: user.role === 'admin' ? 'Administrator' : 
                 user.role === 'manager' ? 'Manager' : 
                 user.role === 'employee' ? 'Employee' : 'Owner'
      }));
    }
  }, [user]);

  const [storeSettings, setStoreSettings] = useState({
    name: 'Warung Barokah',
    address: 'Jl. Pahlawan No. 123, Jakarta',
    phone: '081234567890',
    email: 'warungbarokah@example.com',
    taxId: '12.345.678.9-012.000',
    logo: null,
    establishedDate: new Date(2023, 0, 1),
    openHours: {
      monday: { open: '08:00', close: '21:00', isOpen: true },
      tuesday: { open: '08:00', close: '21:00', isOpen: true },
      wednesday: { open: '08:00', close: '21:00', isOpen: true },
      thursday: { open: '08:00', close: '21:00', isOpen: true },
      friday: { open: '08:00', close: '21:00', isOpen: true },
      saturday: { open: '08:00', close: '21:00', isOpen: true },
      sunday: { open: '08:00', close: '21:00', isOpen: true }
    },
    social: {
      instagram: '',
      facebook: '',
      whatsapp: ''
    }
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUserProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJoinDateChange = (date) => {
    setUserProfile(prev => ({
      ...prev,
      joinDate: date
    }));
  };

  const handleEstablishedDateChange = (date) => {
    setStoreSettings(prev => ({
      ...prev,
      establishedDate: date
    }));
  };

  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreSettings(prev => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value
      }
    }));
  };

  const handleOpenHoursChange = (day, field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      openHours: {
        ...prev.openHours,
        [day]: {
          ...prev.openHours[day],
          [field]: value
        }
      }
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save functionality
    // eslint-disable-next-line no-alert
    window.alert('Perubahan berhasil disimpan!');
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
          userProfile: { ...userProfile, password: undefined },
          storeSettings
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
              if (backupData.userProfile) setUserProfile({ ...backupData.userProfile, password: '', newPassword: '', confirmPassword: '' });
              if (backupData.storeSettings) setStoreSettings(backupData.storeSettings);
              
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
      
      const dataToExport = [
        { Kategori: 'Profile', Item: 'Nama', Nilai: userProfile.name },
        { Kategori: 'Profile', Item: 'Email', Nilai: userProfile.email },
        { Kategori: 'Profile', Item: 'Telepon', Nilai: userProfile.phone },
        { Kategori: 'Profile', Item: 'Jabatan', Nilai: userProfile.position },
        { Kategori: 'Toko', Item: 'Nama Toko', Nilai: storeSettings.name },
        { Kategori: 'Toko', Item: 'Alamat', Nilai: storeSettings.address },
        { Kategori: 'Toko', Item: 'Telepon Toko', Nilai: storeSettings.phone },
        { Kategori: 'Toko', Item: 'Email Toko', Nilai: storeSettings.email },
        { Kategori: 'Toko', Item: 'NPWP', Nilai: storeSettings.taxId },
      ];

      exportToExcel(dataToExport, `Profile_Export_${new Date().toISOString().split('T')[0]}.xlsx`, 'Data Profile');
      // eslint-disable-next-line no-alert
      alert('Data profile berhasil di-export!');
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
      const doubleConfirm = window.confirm('Konfirmasi sekali lagi: Ini akan menghapus SEMUA data. Lanjutkan?');
      
      if (doubleConfirm) {
        // Reset semua data ke default
        setUserProfile({
          name: 'Admin',
          email: 'admin@example.com',
          phone: '',
          position: 'Owner',
          photo: null,
          joinDate: new Date(),
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setStoreSettings({
          name: 'Nama Toko',
          address: '',
          phone: '',
          email: '',
          taxId: '',
          logo: null,
          establishedDate: new Date(),
          openHours: {
            monday: { open: '08:00', close: '21:00', isOpen: true },
            tuesday: { open: '08:00', close: '21:00', isOpen: true },
            wednesday: { open: '08:00', close: '21:00', isOpen: true },
            thursday: { open: '08:00', close: '21:00', isOpen: true },
            friday: { open: '08:00', close: '21:00', isOpen: true },
            saturday: { open: '08:00', close: '21:00', isOpen: true },
            sunday: { open: '08:00', close: '21:00', isOpen: true }
          },
          social: {
            instagram: '',
            facebook: '',
            whatsapp: ''
          }
        });

        // eslint-disable-next-line no-alert
        alert('Semua data telah dihapus dan direset ke pengaturan default.');
      }
    }
  };
  return (
    <div className="profile">
      <Header title="Profile & Pengaturan" />
      
      <div className="profile-header">
        <h1>Profile & Pengaturan</h1>
      </div>      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <FaUser /> Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => handleTabChange('store')}
        >
          <FaStore /> Toko
        </button>
        <button
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => handleTabChange('data')}
        >
          <FaDatabase /> Pengaturan Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Informasi Profile</h2>
            
            <div className="photo-upload">
              {userProfile.photo ? (
                <img src={userProfile.photo} alt="Profile" className="profile-photo" />
              ) : (
                <div className="photo-placeholder">
                  <FaUser />
                </div>
              )}
              <input 
                type="file" 
                id="photo" 
                accept="image/*" 
                onChange={handleFotoChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo" className="upload-button">
                <FaUpload /> Unggah Foto
              </label>
            </div>

            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                name="name"
                value={userProfile.name}
                onChange={handleUserProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userProfile.email}
                onChange={handleUserProfileChange}
              />
            </div>

            <div className="form-group">
              <label>No. Telepon</label>
              <input
                type="tel"
                name="phone"
                value={userProfile.phone}
                onChange={handleUserProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Jabatan</label>
              <input
                type="text"
                name="position"
                value={userProfile.position}
                onChange={handleUserProfileChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Tanggal Bergabung</label>
              <CustomDatePicker
                selected={userProfile.joinDate}
                onChange={handleJoinDateChange}
              />
            </div>

            <h3>Ubah Password</h3>
            <div className="form-group">
              <label>Password Saat Ini</label>
              <input
                type="password"
                name="password"
                value={userProfile.password}
                onChange={handleUserProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={userProfile.newPassword}
                onChange={handleUserProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={userProfile.confirmPassword}
                onChange={handleUserProfileChange}
              />
            </div>

            <button type="submit" className="save-button">
              <FaSave /> Simpan Perubahan
            </button>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="profile-section">
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
                  style={{ display: 'none' }}
                />
                <label htmlFor="logo" className="upload-button">
                  <FaUpload /> Unggah Logo
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Nama Toko</label>
              <input
                type="text"
                name="name"
                value={storeSettings.name}
                onChange={handleStoreSettingsChange}
              />
            </div>

            <div className="form-group">
              <label>Tanggal Berdiri</label>
              <CustomDatePicker
                selected={storeSettings.establishedDate}
                onChange={handleEstablishedDateChange}
              />
            </div>

            <div className="form-group">
              <label>Alamat</label>
              <textarea
                name="address"
                value={storeSettings.address}
                onChange={handleStoreSettingsChange}
              />
            </div>

            <div className="form-group">
              <label>No. Telepon</label>
              <input
                type="tel"
                name="phone"
                value={storeSettings.phone}
                onChange={handleStoreSettingsChange}
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

            <h3>Jam Operasional</h3>
            <div className="operating-hours">
              {Object.entries(storeSettings.openHours).map(([day, hours]) => (
                <div key={day} className="day-hours">
                  <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                  <div className="hours-input">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleOpenHoursChange(day, 'open', e.target.value)}
                      disabled={!hours.isOpen}
                    />
                    <span>s/d</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleOpenHoursChange(day, 'close', e.target.value)}
                      disabled={!hours.isOpen}
                    />
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => handleOpenHoursChange(day, 'isOpen', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h3>Media Sosial</h3>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={storeSettings.social.instagram}
                onChange={handleSocialChange}
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <input
                type="text"
                name="facebook"
                value={storeSettings.social.facebook}
                onChange={handleSocialChange}
                placeholder="facebook.com/your-page"
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                value={storeSettings.social.whatsapp}
                onChange={handleSocialChange}
                placeholder="+62xxx"
              />
            </div>            <button type="submit" className="save-button">
              <FaSave /> Simpan Perubahan
            </button>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="profile-section">
            <h2>Manajemen Data</h2>
            <p className="section-description">
              Kelola data aplikasi Anda dengan fitur backup, restore, export, dan reset data.
            </p>
            
            <div className="data-management">
              <div className="data-action">
                <div className="action-info">
                  <h3><FaDownload /> Backup Data</h3>
                  <p>Buat cadangan data profile dan toko Anda untuk mencegah kehilangan data.</p>
                </div>
                <button 
                  type="button" 
                  className="action-button primary"
                  onClick={handleBackupData}
                >
                  Backup Sekarang
                </button>
              </div>
              
              <div className="data-action">
                <div className="action-info">
                  <h3><FaUpload /> Restore Data</h3>
                  <p>Pulihkan data dari file backup yang telah dibuat sebelumnya.</p>
                </div>
                <button 
                  type="button" 
                  className="action-button secondary"
                  onClick={handleRestoreData}
                >
                  Restore Data
                </button>
              </div>
              
              <div className="data-action">
                <div className="action-info">
                  <h3><FaFileExcel /> Export Data</h3>
                  <p>Export data profile dan pengaturan toko ke format Excel.</p>
                </div>
                <button 
                  type="button" 
                  className="action-button success"
                  onClick={handleExportData}
                >
                  Export Data
                </button>
              </div>
              
              <div className="data-action warning">
                <div className="action-info">
                  <h3><FaTrash /> Reset Semua Data</h3>
                  <p>Hapus semua data dan kembalikan ke pengaturan default. <strong>Tindakan ini tidak dapat dibatalkan!</strong></p>
                </div>
                <button 
                  type="button" 
                  className="action-button danger"
                  onClick={handleDeleteAllData}
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
