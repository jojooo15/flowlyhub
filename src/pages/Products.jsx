import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Nasi Goreng', category: 'Makanan', price: 15000, stock: 0 },
    { id: 2, name: 'Mie Goreng', category: 'Makanan', price: 12000, stock: 0 },
    { id: 3, name: 'Es Teh', category: 'Minuman', price: 5000, stock: 20 },
    { id: 4, name: 'Es Jeruk', category: 'Minuman', price: 6000, stock: 15 },
    { id: 5, name: 'Ayam Goreng', category: 'Makanan', price: 18000, stock: 10 },
    { id: 6, name: 'Soto Ayam', category: 'Makanan', price: 15000, stock: 0 },
    { id: 7, name: 'Kopi', category: 'Minuman', price: 7000, stock: 25 },
    { id: 8, name: 'Teh Botol', category: 'Minuman', price: 6000, stock: 30 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    };
    
    setProducts([...products, productToAdd]);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Manajemen Produk</h1>
        <button className="add-button" onClick={handleAddProduct}>
          <FaPlus /> Tambah Produk
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Cari produk..." 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {showAddForm && (
        <div className="add-product-form">
          <h2>Tambah Produk Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Produk</label>
              <input 
                type="text" 
                name="name" 
                value={newProduct.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select 
                name="category" 
                value={newProduct.category} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Snack">Snack</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="form-group">
              <label>Harga (Rp)</label>
              <input 
                type="number" 
                name="price" 
                value={newProduct.price} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Stok</label>
              <input 
                type="number" 
                name="stock" 
                value={newProduct.stock} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-button">Simpan</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowAddForm(false)}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>Rp {product.price.toLocaleString('id-ID')}</td>
                <td>{product.stock}</td>
                <td className="action-buttons">
                  <button className="edit-button">
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
