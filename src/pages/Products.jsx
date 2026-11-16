import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaChartLine } from 'react-icons/fa';
import Header from '../components/Header';
import AddProductOverlay from '../components/AddProductOverlay';
import EditProductOverlay from '../components/EditProductOverlay';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.stock.getAll();
      
      if (response && response.success && response.data && response.data.stocks) {
        const stocks = response.data.stocks;

        const updatedStocks = await Promise.all(
          stocks.map(async (item) => {
            const status = await calculateStatusAi(item);
            return {
              ...item,
              status: status,
            };
          })
        );

        setProducts(updatedStocks);

      } else {
        throw new Error('Failed to load products data');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.message === 'Authentication required') {
        window.location.href = '/login';
      } else {
        setError(err.message || 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      product.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesFilter = filter === 'all' || product.kategori === filter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const calculateStatus = (item) => {
    const stokAkhir = (parseInt(item.stok_awal || 0) + parseInt(item.masuk || 0)) - parseInt(item.keluar || 0);
    const minimum = parseInt(item.minimum_stock || 10);
    
    if (stokAkhir <= minimum * 0.5) return 'STOK BERISIKO';
    if (stokAkhir <= minimum) return 'STOK MENIPIS';
    if (stokAkhir >= minimum * 2) return 'STOK STABIL';
    return 'STOK AMAN';
  };

  const calculateStatusAi = async (item) => {
    const response = await api.stock.predict({"code":item.kode});
    console.log(response.data.status)
    return response.data.status;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'STOK STABIL': return 'bg-blue-500';
      case 'STOK AMAN': return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchProducts();
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  if (error) {
    return <div className="text-red-500 text-center mt-5">Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <Header title="Stok Barang" />
      
      <div className="products-controls">
        <button 
          className="add-product-btn"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus /> Tambah Barang
        </button>
        <div className='filter-option'>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua</option>
              <option value="bahan-baku">Bahan Baku</option>
              <option value="minuman">Minuman</option>
              <option value="makanan">Makanan</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua</option>
              <option value="STOK STABIL">STOK STABIL</option>
              <option value="STOK AMAN">STOK AMAN</option>
              <option value="STOK BERISIKO ⚠">STOK BERISIKO ⚠</option>
            </select>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Cari berdasarkan kode atau nama barang..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>


      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Stok Awal</th>
                <th>Masuk</th>
                <th>Keluar</th>
                <th>Stok Akhir</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stokAkhir = (
                  parseInt(product.stok_awal || 0) + 
                  parseInt(product.masuk || 0) - 
                  parseInt(product.keluar || 0)
                );
                const status = product.status;
                const statusColor = getStatusColor(status);

                return (
                  <tr key={product._id}>
                    <td>{product.kode}</td>
                    <td>{product.nama_barang}</td>
                    <td>{product.kategori}</td>
                    <td>{product.satuan}</td>
                    <td>{product.stok_awal}</td>
                    <td>{product.masuk}</td>
                    <td>{product.keluar}</td>
                    <td>{stokAkhir}</td>
                    <td>
                      <span className={`status-badge ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="chart-btn"
                          onClick={() => {
                            setSelectedProduct(product);
                          }}
                        >
                          <FaChartLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <AddProductOverlay
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onProductAdded={handleAddSuccess}
        />
      )}

      {showEditForm && selectedProduct && (
        <EditProductOverlay
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Products;
