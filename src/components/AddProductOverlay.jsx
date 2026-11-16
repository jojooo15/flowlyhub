import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import '../styles/AddProductOverlay.css';

const AddProductOverlay = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    kode: '',
    nama_barang: '',
    kategori: 'bahan-baku',
    stok_awal: '',
    masuk: 0,
    keluar: 0,
    satuan: 'kg',
    harga_beli: '',
    harga_jual: '',
    minimum_stock: 10,
    supplier: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate all required fields
      if (!formData.kode || !formData.nama_barang || !formData.stok_awal) {
        setError('Harap isi Kode Barang, Nama Barang, dan Stok Awal');
        setLoading(false);
        return;
      }

      // Validate numbers
      if (isNaN(parseFloat(formData.harga_beli)) || isNaN(parseFloat(formData.harga_jual))) {
        setError('Harga Beli dan Harga Jual harus berupa angka');
        setLoading(false);
        return;
      }

      console.log('Submitting product data:', formData);

      // Prepare stock data with all required fields
      const stockData = {
        kode: formData.kode.toUpperCase(),
        nama_barang: formData.nama_barang,
        kategori: formData.kategori,
        stok_awal: parseInt(formData.stok_awal) || 0,
        masuk: parseInt(formData.masuk) || 0,
        keluar: parseInt(formData.keluar) || 0,
        satuan: formData.satuan,
        harga_beli: parseFloat(formData.harga_beli) || 0,
        harga_jual: parseFloat(formData.harga_jual) || 0,
        minimum_stock: parseInt(formData.minimum_stock) || 10,
        supplier: formData.supplier || '',
        keterangan: formData.keterangan || ''
      };

      console.log('Sending to API:', stockData);

      // Send to API
      const response = await api.stock.create(stockData);
      console.log('API Response:', response);

      if (response.success) {
        // Notify parent component
        if (onProductAdded) {
          onProductAdded(response.data);
        }
        
        // Reset form
        setFormData({
          kode: '',
          nama_barang: '',
          kategori: 'bahan-baku',
          stok_awal: '',
          masuk: 0,
          keluar: 0,
          satuan: 'kg',
          harga_beli: '',
          harga_jual: '',
          minimum_stock: 10,
          supplier: '',
          keterangan: ''
        });

        // Close overlay
        onClose();
      } else {
        throw new Error(response.message || 'Gagal menambahkan produk');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.response?.data?.message || error.message || 'Gagal menambahkan produk');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="modal-header">
          <h2>Tambah Barang</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-field">
            <label htmlFor="kode">Kode Barang *</label>
            <input
              type="text"
              id="kode"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              placeholder="e.g., BB0001"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="nama_barang">Nama Barang *</label>
            <input
              type="text"
              id="nama_barang"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleChange}
              placeholder="e.g., Beras Premium"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="kategori">Kategori *</label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
              >
                <option value="bahan-baku">Bahan Baku</option>
                <option value="minuman">Minuman</option>
                <option value="makanan">Makanan</option>
                <option value="peralatan">Peralatan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="satuan">Satuan *</label>
              <select
                id="satuan"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="gram">Gram</option>
                <option value="liter">Liter</option>
                <option value="ml">Mililiter (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="dozen">Dozen</option>
                <option value="sachet">Sachet</option>
                <option value="botol">Botol</option>
                <option value="kaleng">Kaleng</option>
                <option value="bungkus">Bungkus</option>
                <option value="potong">Potong</option>
                <option value="galon">Galon</option>
                <option value="buah">Buah</option>
                <option value="tabung">Tabung</option>
                <option value="porsi">Porsi</option>
                <option value="gelas">Gelas</option>
                <option value="butir">Butir</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="stok_awal">Stok Awal *</label>
              <input
                type="number"
                id="stok_awal"
                name="stok_awal"
                value={formData.stok_awal}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="masuk">Masuk</label>
              <input
                type="number"
                id="masuk"
                name="masuk"
                value={formData.masuk}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-field">
              <label htmlFor="keluar">Keluar</label>
              <input
                type="number"
                id="keluar"
                name="keluar"
                value={formData.keluar}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="minimum_stock">Minimum Stok</label>
            <input
              type="number"
              id="minimum_stock"
              name="minimum_stock"
              value={formData.minimum_stock}
              onChange={handleChange}
              min="0"
              placeholder="10"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="harga_beli">Harga Beli (Rp) *</label>
              <input
                type="number"
                id="harga_beli"
                name="harga_beli"
                value={formData.harga_beli}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="harga_jual">Harga Jual (Rp) *</label>
              <input
                type="number"
                id="harga_jual"
                name="harga_jual"
                value={formData.harga_jual}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Nama supplier (opsional)"
            />
          </div>

          <div className="form-field">
            <label htmlFor="keterangan">Keterangan</label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              placeholder="Keterangan tambahan (opsional)"
              rows="3"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Menambah...' : 'Tambah Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddProductOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductAdded: PropTypes.func
};

export default AddProductOverlay;