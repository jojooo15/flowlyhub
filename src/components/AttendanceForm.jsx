import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaClock, FaMapMarkerAlt, FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../styles/AttendanceForm.css';
import api from '../services/api';

const AttendanceForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'clock-in', // 'clock-in' or 'clock-out'
    notes: '',
    location: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInStatus, setClockInStatus] = useState(null);
  useEffect(() => {
    if (isOpen) {
      // Update time every second
      const timer = window.setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      // Get current location
      getCurrentLocation();
      
      // Check today's status
      checkTodayStatus();

      return () => window.clearInterval(timer);
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan.');
        }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser ini.');
    }
  };

  const checkTodayStatus = async () => {
    try {
      const response = await api.attendance.getTodayStatus();
      if (response.success) {
        setClockInStatus(response.data);
        // Set default type based on status
        if (response.data.hasClockIn && !response.data.hasClockOut) {
          setFormData(prev => ({ ...prev, type: 'clock-out' }));
        }
      }
    } catch (err) {
      console.error('Error checking today status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location) {
      setError('Lokasi diperlukan untuk absensi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (formData.type === 'clock-in') {
        response = await api.attendance.clockIn({
          location: formData.location,
          notes: formData.notes
        });
      } else {
        response = await api.attendance.clockOut({
          notes: formData.notes
        });
      }

      if (response.success) {
        onSuccess(response.data);
        handleClose();      } else {
        setError(response.message || 'Gagal melakukan absensi');
      }
    } catch (err) {
      console.error('Attendance error:', err);
      setError(err.message || 'Terjadi kesalahan saat melakukan absensi');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'clock-in',
      notes: '',
      location: null
    });
    setError('');
    onClose();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="attendance-overlay">
      <div className="attendance-form-container">
        <div className="attendance-form-header">
          <h2>Isi Kehadiran</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="current-datetime">
          <div className="current-time">
            <FaClock className="time-icon" />
            <span className="time-display">{formatTime(currentTime)}</span>
          </div>
          <div className="current-date">
            {formatDate(currentTime)}
          </div>
        </div>

        {clockInStatus && (
          <div className="attendance-status">
            <div className={`status-indicator ${clockInStatus.hasClockIn ? 'clocked-in' : 'not-clocked'}`}>
              {clockInStatus.hasClockIn ? (
                <>
                  <FaCheckCircle />
                  <span>Sudah Clock In - {clockInStatus.clockInTime}</span>
                </>
              ) : (
                <>
                  <FaTimesCircle />
                  <span>Belum Clock In Hari Ini</span>
                </>
              )}
            </div>
            {clockInStatus.hasClockOut && (
              <div className="status-indicator clocked-out">
                <FaCheckCircle />
                <span>Sudah Clock Out - {clockInStatus.clockOutTime}</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label>Jenis Absensi</label>
            <div className="attendance-type-selector">
              <button
                type="button"
                className={`type-button ${formData.type === 'clock-in' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'clock-in' }))}
                disabled={clockInStatus?.hasClockIn && !clockInStatus?.hasClockOut}
              >
                <FaClock />
                Clock In
              </button>
              <button
                type="button"
                className={`type-button ${formData.type === 'clock-out' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'clock-out' }))}
                disabled={!clockInStatus?.hasClockIn || clockInStatus?.hasClockOut}
              >
                <FaClock />
                Clock Out
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Lokasi</label>
            <div className="location-info">
              <FaMapMarkerAlt className="location-icon" />
              {formData.location ? (
                <span className="location-text">
                  {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                </span>
              ) : (
                <span className="location-loading">Mengambil lokasi...</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Catatan (Opsional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Tambahkan catatan untuk absensi ini..."
              rows="3"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading || !formData.location}
            >
              {loading ? 'Memproses...' : (
                formData.type === 'clock-in' ? 'Clock In' : 'Clock Out'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AttendanceForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default AttendanceForm;