import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import '../styles/AddProductOverlay.css'; // Menggunakan CSS yang sama

const EditProductOverlay = ({ isOpen, onClose, onProductUpdated, product }) => {
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

  // Populate form with existing product data when product changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        kode: product.kode || '',
        nama_barang: product.nama_barang || '',
        kategori: product.kategori || 'bahan-baku',
        stok_awal: product.stok_awal || '',
        masuk: product.masuk || 0,
        keluar: product.keluar || 0,
        satuan: product.satuan || 'kg',
        harga_beli: product.harga_beli || '',
        harga_jual: product.harga_jual || '',
        minimum_stock: product.minimum_stock || 10,
        supplier: product.supplier || '',
        keterangan: product.keterangan || ''
      });
      setError('');
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.kode || !formData.nama_barang || !formData.stok_awal || !formData.harga_beli || !formData.harga_jual) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }      // Prepare data for API
      const stockData = {
        _id: product._id, // Include the ID for updating
        kode: formData.kode.toUpperCase(),
        nama_barang: formData.nama_barang,
        kategori: formData.kategori,
        satuan: formData.satuan,
        stok_awal: parseInt(formData.stok_awal),
        stok_akhir: parseInt(formData.stok_awal) - parseInt(formData.keluar || 0) + parseInt(formData.masuk || 0),
        masuk: parseInt(formData.masuk) || 0,
        keluar: parseInt(formData.keluar) || 0,
        harga_beli: parseFloat(formData.harga_beli),
        harga_jual: parseFloat(formData.harga_jual),
        minimum_stock: parseInt(formData.minimum_stock) || 10,
        nilai: parseFloat(formData.harga_jual) * (parseInt(formData.stok_awal) - parseInt(formData.keluar || 0) + parseInt(formData.masuk || 0)),
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        supplier: formData.supplier || '',
        keterangan: formData.keterangan || ''
      };

      console.log('Updating product:', product._id || product.kode);
      console.log('Updating stock data:', stockData);
      const response = await api.stock.update(product._id, stockData);
      console.log('API response:', response);

      if (response.success || response.data?.success) {
        console.log('Product updated successfully:', response.data || response);
        
        // Notify parent component
        if (onProductUpdated) {
          const productData = response.data || response;
          onProductUpdated(productData.data || productData);
        }
        
        onClose();
      } else {
        throw new Error('Failed to update product - no success response');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="modal-header">
          <h2>Edit Barang</h2>
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
              disabled // Kode tidak bisa diubah
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Kode barang tidak dapat diubah</small>
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
                placeholder="0"
                required
              />
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
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="masuk">Barang Masuk</label>
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
              <label htmlFor="keluar">Barang Keluar</label>
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
              {loading ? 'Mengupdate...' : 'Update Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProductOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func,
  product: PropTypes.object
};

export default EditProductOverlay;
