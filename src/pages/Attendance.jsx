import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaSearch, FaFilePdf, FaFileExcel, FaPrint, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Header from '../components/Header';
import CustomDatePicker from '../components/CustomDatePicker';
import LoadingSpinner from '../components/LoadingSpinner';
import AttendanceForm from '../components/AttendanceForm';
import Notification from '../components/Notification';
import { exportAttendanceToExcel } from '../utils/excelGenerator';
import { generatePdf, downloadPdf } from '../utils/pdfGenerator';
import api from '../services/api';
import '../styles/Attendance.css';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clockInStatus, setClockInStatus] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.attendance.getCsvData({
        startDate: selectedDate.toISOString().split('T')[0],
        endDate: selectedDate.toISOString().split('T')[0],
        limit: 100
      });
      
      if (response.success) {
        setAttendance(response.data || []);
      }
      
      // Also fetch statistics
      const statsResponse = await api.attendance.getStats();
      if (statsResponse.success) {
        setAttendanceStats(statsResponse.data);
      }    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Gagal memuat data absensi. Pastikan backend server berjalan.');
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const checkTodayStatus = async () => {
    try {
      const response = await api.attendance.getTodayStatus();
      if (response.success) {
        setClockInStatus(response.data);
      }
    } catch (err) {
      console.error('Error checking today status:', err);
    }  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          // eslint-disable-next-line no-console
          console.error('Error getting location:', err);
        }
      );
    }
  };
  useEffect(() => {
    fetchAttendanceData();
    checkTodayStatus();
    getCurrentLocation();
  }, [selectedDate, fetchAttendanceData]);
  // Filter data berdasarkan pencarian
  const filteredAttendance = attendance.filter(item =>
    (item.nama_karyawan && item.nama_karyawan.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.id_karyawan && item.id_karyawan.toString().includes(searchTerm))
  );
  // Fungsi untuk unduh PDF
  const handleDownloadPDF = () => {
    try {
      const storeProfile = {
        name: 'FlowlyHub Store',
        address: 'Jl. Contoh No. 123',
        phone: '0812-3456-7890'
      };

      const params = {
        startDate: selectedDate.toLocaleDateString('id-ID'),
        endDate: selectedDate.toLocaleDateString('id-ID')
      };

      const formattedData = filteredAttendance.map(item => ({
        employeeId: item.id_karyawan,
        employeeName: item.nama_karyawan,
        position: 'Karyawan',
        date: item.tanggal,
        checkInTime: item.jam_masuk,
        checkOutTime: '-',
        status: item.terlambat === 0 ? 'Hadir' : 'Terlambat',
        notes: `Cuaca: ${item.cuaca}, Hari: ${item.hari}`
      }));

      const doc = generatePdf('attendance', formattedData, params, storeProfile);
      downloadPdf(doc, `Laporan_Absensi_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating PDF:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    }
  };

  // Fungsi untuk unduh Excel
  const handleDownloadExcel = () => {
    try {
      exportAttendanceToExcel(filteredAttendance);
      // eslint-disable-next-line no-alert
      alert('File Excel berhasil diunduh!');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error exporting to Excel:', error);
      // eslint-disable-next-line no-alert
      alert('Gagal mengunduh Excel. Silakan coba lagi.');
    }
  };
  // Fungsi untuk cetak
  const handlePrint = () => {
    window.print();
  };  const handleAttendanceSuccess = (data) => {
    console.log('Attendance success:', data);
    // Refresh data after successful attendance
    fetchAttendanceData();
    checkTodayStatus();
    // Show success notification
    setNotification({
      isVisible: true,
      type: 'success',
      message: data.message || 'Absensi berhasil disimpan!'
    });
    setError(null);
    
    // Add new attendance record to current display if it's for today
    if (data.attendanceRecord) {
      const today = new Date().toISOString().split('T')[0];
      const recordDate = data.attendanceRecord.tanggal;
      
      if (recordDate === today || recordDate === selectedDate.toISOString().split('T')[0]) {
        // Add to current attendance list
        setAttendance(prev => [data.attendanceRecord, ...prev]);
      }
    }
  };
  return (
    <div className="attendance">
      {loading && <LoadingSpinner />}      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Tutup</button>
        </div>
      )}
      
      <Header title="Absensi" />
      
      <div className="attendance-header">
        <div className="title">
          <h1>Absensi</h1>
          <div className="date-filter">
            <CustomDatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              placeholderText="Pilih tanggal"
            />
          </div>
        </div>        <div className="header-actions">
          <button className="add-button">
            <FaPlus /> Tambah Pegawai
          </button>
          <button 
            className="isi-kehadiran-button"
            onClick={() => setShowAttendanceForm(true)}
          >
            Isi Kehadiran
          </button>
        </div>
      </div>

      <div className="attendance-content">{clockInStatus && (
          <div className="clock-status">
            <p>Status: {clockInStatus.hasClockIn ? 'Sudah Clock In' : 'Belum Clock In'}</p>
            {currentLocation && (
              <p>Lokasi: {currentLocation.latitude}, {currentLocation.longitude}</p>
            )}
          </div>
        )}
        
        {attendanceStats && (
          <div className="attendance-stats">
            <div className="stat-card">
              <h3>Total Kehadiran</h3>
              <p>{attendanceStats.summary?.totalRecords || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Tepat Waktu</h3>
              <p>{attendanceStats.summary?.onTimeRecords || 0} ({attendanceStats.summary?.onTimePercentage || 0}%)</p>
            </div>
            <div className="stat-card">
              <h3>Terlambat</h3>
              <p>{attendanceStats.summary?.lateRecords || 0} ({attendanceStats.summary?.latePercentage || 0}%)</p>
            </div>
          </div>
        )}

        <div className="filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari pegawai..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Status</th>
                <th>Cuaca</th>
                <th>Sumber</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.id_karyawan}</td>
                  <td>{item.nama_karyawan}</td>
                  <td>{item.tanggal}</td>
                  <td>{item.jam_masuk}</td>
                  <td>{item.jam_keluar || '-'}</td>
                  <td>
                    <span className={`status-badge ${item.terlambat === 0 ? 'on-time' : 'late'}`}>
                      {item.terlambat === 0 ? 'Tepat Waktu' : 'Terlambat'}
                    </span>
                  </td>
                  <td>{item.cuaca}</td>
                  <td>
                    <span className={`source-badge ${item.source === 'form_input' ? 'form' : 'csv'}`}>
                      {item.source === 'form_input' ? 'Form' : 'Data'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="export-buttons">
          <button className="export-button" onClick={handleDownloadPDF}>
            <FaFilePdf /> Unduh PDF
          </button>
          <button className="export-button" onClick={handleDownloadExcel}>
            <FaFileExcel /> Unduh Excel
          </button>
          <button className="export-button" onClick={handlePrint}>
            <FaPrint /> Cetak
          </button>        </div>
      </div>      {/* Attendance Form Overlay */}
      <AttendanceForm
        isOpen={showAttendanceForm}
        onClose={() => setShowAttendanceForm(false)}
        onSuccess={handleAttendanceSuccess}
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Attendance;
