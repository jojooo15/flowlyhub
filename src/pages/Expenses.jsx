import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import '../styles/Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      date: '2025-05-20', 
      category: 'Bahan Baku', 
      description: 'Belanja bahan makanan', 
      amount: 850000,
      paymentMethod: 'Cash'
    },
    { 
      id: 2, 
      date: '2025-05-18', 
      category: 'Gaji Karyawan', 
      description: 'Gaji mingguan pelayan', 
      amount: 500000,
      paymentMethod: 'Transfer'
    },
    { 
      id: 3, 
      date: '2025-05-15', 
      category: 'Listrik & Air', 
      description: 'Tagihan listrik bulan Mei', 
      amount: 450000,
      paymentMethod: 'Transfer'
    },
    { 
      id: 4, 
      date: '2025-05-10', 
      category: 'Bahan Baku', 
      description: 'Belanja bahan minuman', 
      amount: 350000,
      paymentMethod: 'Cash'
    },
    { 
      id: 5, 
      date: '2025-05-05', 
      category: 'Transportasi', 
      description: 'Bensin untuk pengiriman', 
      amount: 200000,
      paymentMethod: 'Cash'
    },
    { 
      id: 6, 
      date: '2025-05-01', 
      category: 'Sewa Tempat', 
      description: 'Sewa tempat bulan Mei', 
      amount: 1500000,
      paymentMethod: 'Transfer'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
    paymentMethod: 'Cash'
  });

  const categories = [
    'Bahan Baku',
    'Gaji Karyawan',
    'Sewa Tempat',
    'Listrik & Air',
    'Transportasi',
    'Peralatan',
    'Pemasaran',
    'Lain-lain'
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  const filteredExpenses = expenses.filter(expense => 
    (expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     expense.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || expense.category === filterCategory)
  );

  const handleAddExpense = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    
    const expenseToAdd = {
      id: newId,
      date: newExpense.date,
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paymentMethod: newExpense.paymentMethod
    };
    
    setExpenses([expenseToAdd, ...expenses]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: '',
      paymentMethod: 'Cash'
    });
    setShowAddForm(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h1>Manajemen Pengeluaran</h1>
        <button className="add-button" onClick={handleAddExpense}>
          <FaPlus /> Tambah Pengeluaran
        </button>
      </div>

      <div className="filters-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari pengeluaran..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="category-filter">
          <FaFilter className="filter-icon" />
          <select 
            value={filterCategory} 
            onChange={handleCategoryFilter}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="add-expense-form">
          <h2>Tambah Pengeluaran Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tanggal</label>
              <input 
                type="date" 
                name="date" 
                value={newExpense.date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select 
                name="category" 
                value={newExpense.category} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <input 
                type="text" 
                name="description" 
                value={newExpense.description} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Jumlah (Rp)</label>
              <input 
                type="number" 
                name="amount" 
                value={newExpense.amount} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Metode Pembayaran</label>
              <select 
                name="paymentMethod" 
                value={newExpense.paymentMethod} 
                onChange={handleInputChange} 
                required
              >
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer Bank</option>
                <option value="Debit">Kartu Debit</option>
                <option value="Credit">Kartu Kredit</option>
                <option value="QRIS">QRIS</option>
              </select>
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

      <div className="expenses-summary">
        <div className="summary-card">
          <h3>Total Pengeluaran</h3>
          <p className="amount">Rp {totalExpenses.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah</th>
              <th>Metode Pembayaran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString('id-ID')}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>Rp {expense.amount.toLocaleString('id-ID')}</td>
                <td>{expense.paymentMethod}</td>
                <td className="action-buttons">
                  <button className="edit-button">
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteExpense(expense.id)}
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

export default Expenses;
