import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import CustomDatePicker from './CustomDatePicker';
import api from '../services/api';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/AddTransactionOverlay.css';

const AddTransactionOverlay = ({ isOpen, onClose, onTransactionAdded }) => {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({
    tanggal: new Date(),
    jenis_transaksi: 'Pemasukan',
    kategori_transaksi: '',
    jumlah: '',
    keterangan: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      tanggal: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.kategori_transaksi || !formData.jumlah) {
        setError('Harap isi semua field yang diperlukan');
        return;
      }

      // Validate amount
      if (isNaN(parseFloat(formData.jumlah)) || parseFloat(formData.jumlah) <= 0) {
        setError('Jumlah harus berupa angka positif');
        return;
      }

      const transactionData = {
        ...formData,
        jumlah: parseFloat(formData.jumlah),
        tanggal: formData.tanggal.toISOString(),
        createdBy: user._id // Add the user ID from context
      };


      const response = await api.reports.createTransaction(transactionData);

      if (response.success) {
        onTransactionAdded(response.data);
        onClose();
      } else {
        setError(response.message || 'Gagal menambah transaksi');
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message || 'Terjadi kesalahan saat menambah transaksi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h2>Tambah Transaksi Baru</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tanggal">Tanggal</label>
            <CustomDatePicker
              selected={formData.tanggal}
              onChange={handleDateChange}
              maxDate={new Date()}
              placeholderText="Pilih tanggal"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jenis_transaksi">Jenis Transaksi</label>
            <select
              id="jenis_transaksi"
              name="jenis_transaksi"
              value={formData.jenis_transaksi}
              onChange={handleChange}
              required
            >
              <option value="Pemasukan">Pemasukan</option>
              <option value="Pengeluaran">Pengeluaran</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="kategori_transaksi">Kategori</label>
            <input
              type="text"
              id="kategori_transaksi"
              name="kategori_transaksi"
              value={formData.kategori_transaksi}
              onChange={handleChange}
              required
              placeholder="Masukkan kategori transaksi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jumlah">Jumlah (Rp)</label>
            <input
              type="number"
              id="jumlah"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              required
              min="1"
              step="1"
              placeholder="Masukkan jumlah"
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterangan">Keterangan</label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Masukkan keterangan (opsional)"
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Batal
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddTransactionOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTransactionAdded: PropTypes.func.isRequired
};

export default AddTransactionOverlay;
