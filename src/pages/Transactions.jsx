import { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaFileInvoice } from 'react-icons/fa';
import '../styles/Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    { 
      id: 'TRX-001', 
      date: '2025-05-21', 
      customer: 'Ani', 
      items: [
        { name: 'Nasi Goreng', qty: 2, price: 15000 },
        { name: 'Es Teh', qty: 2, price: 5000 }
      ],
      total: 40000,
      paymentMethod: 'Cash',
      status: 'Completed'
    },
    { 
      id: 'TRX-002', 
      date: '2025-05-21', 
      customer: 'Budi', 
      items: [
        { name: 'Mie Goreng', qty: 1, price: 12000 },
        { name: 'Ayam Goreng', qty: 1, price: 18000 },
        { name: 'Es Jeruk', qty: 2, price: 6000 }
      ],
      total: 42000,
      paymentMethod: 'QRIS',
      status: 'Completed'
    },
    { 
      id: 'TRX-003', 
      date: '2025-05-20', 
      customer: 'Citra', 
      items: [
        { name: 'Soto Ayam', qty: 2, price: 15000 }
      ],
      total: 30000,
      paymentMethod: 'Cash',
      status: 'Completed'
    },
    { 
      id: 'TRX-004', 
      date: '2025-05-20', 
      customer: 'Dodi', 
      items: [
        { name: 'Nasi Goreng', qty: 3, price: 15000 },
        { name: 'Es Teh', qty: 3, price: 5000 },
        { name: 'Ayam Goreng', qty: 1, price: 18000 }
      ],
      total: 78000,
      paymentMethod: 'Transfer',
      status: 'Completed'
    },
    { 
      id: 'TRX-005', 
      date: '2025-05-19', 
      customer: 'Eko', 
      items: [
        { name: 'Kopi', qty: 4, price: 7000 },
        { name: 'Mie Goreng', qty: 2, price: 12000 }
      ],
      total: 52000,
      paymentMethod: 'QRIS',
      status: 'Completed'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilter = (e) => {
    setFilterDate(e.target.value);
  };

  const filteredTransactions = transactions.filter(transaction => 
    (transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDate === '' || transaction.date === filterDate)
  );

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Riwayat Transaksi</h1>
      </div>

      <div className="filters-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari transaksi..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="date-filter">
          <FaFilter className="filter-icon" />
          <input 
            type="date" 
            value={filterDate}
            onChange={handleDateFilter}
          />
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Total</th>
              <th>Metode Pembayaran</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                <td>{transaction.customer}</td>
                <td>Rp {transaction.total.toLocaleString('id-ID')}</td>
                <td>{transaction.paymentMethod}</td>
                <td>
                  <span className={`status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button 
                    className="view-button"
                    onClick={() => viewTransactionDetails(transaction)}
                  >
                    <FaEye />
                  </button>
                  <button className="invoice-button">
                    <FaFileInvoice />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && selectedTransaction && (
        <div className="transaction-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Detail Transaksi {selectedTransaction.id}</h2>
              <button className="close-button" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="transaction-info">
                <p><strong>Tanggal:</strong> {new Date(selectedTransaction.date).toLocaleDateString('id-ID')}</p>
                <p><strong>Pelanggan:</strong> {selectedTransaction.customer}</p>
                <p><strong>Metode Pembayaran:</strong> {selectedTransaction.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedTransaction.status}</p>
              </div>
              <div className="transaction-items">
                <h3>Item yang Dibeli</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Jumlah</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTransaction.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>Rp {item.price.toLocaleString('id-ID')}</td>
                        <td>Rp {(item.qty * item.price).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">Total</td>
                      <td className="total-amount">Rp {selectedTransaction.total.toLocaleString('id-ID')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="print-button">Cetak Struk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
