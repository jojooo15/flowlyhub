import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import { employeeData } from '../services/mockData';
import '../styles/Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState(employeeData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    employeeId: ''
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddEmployee = () => {
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      address: '',
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`
    });
    setEditingEmployee(null);
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setFormData({ ...employee });
    setEditingEmployee(employee);
    setShowAddModal(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      // eslint-disable-next-line no-alert
      alert('Karyawan berhasil dihapus!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ));
      // eslint-disable-next-line no-alert
      alert('Data karyawan berhasil diperbarui!');
    } else {
      // Add new employee
      const newEmployee = {
        id: employees.length + 1,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Aktif'
      };
      setEmployees([...employees, newEmployee]);
      // eslint-disable-next-line no-alert
      alert('Karyawan baru berhasil ditambahkan!');
    }
    
    setShowAddModal(false);
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      address: '',
      employeeId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="employees">
      <div className="employees-header">
        <h1>Karyawan</h1>        <button className="add-employee-button" onClick={handleAddEmployee}>
          <FaPlus /> Tambah Karyawan
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button className="filter-button">
          <FaFilter /> Filter
        </button>
      </div>

      <div className="employees-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Email</th>
              <th>No. Telepon</th>
              <th>Tanggal Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.employeeId}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{new Date(employee.joinDate).toLocaleDateString('id-ID')}</td>
                <td>
                  <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>                <td className="action-buttons">
                  <button 
                    className="action-button" 
                    title="Edit"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-button" 
                    title="Hapus"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah/Edit Karyawan */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
              <button 
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>ID Karyawan</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    readOnly={!!editingEmployee}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jabatan</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Jabatan</option>
                    <option value="Manager">Manager</option>
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Koki">Koki</option>
                    <option value="Pelayan">Pelayan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Alamat</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="submit-button">
                  {editingEmployee ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
