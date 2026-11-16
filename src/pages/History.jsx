import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Header from '../components/Header';
import CustomDatePicker from '../components/CustomDatePicker';
import '../styles/History.css';

const History = () => {
  const [dateRange, setDateRange] = useState([
    new Date('2025-05-01'),
    new Date('2025-05-21')
  ]);
  const [filterActivityType, setFilterActivityType] = useState('');

  const activities = [
    { 
      timestamp: '2025-05-21 08:30',
      type: 'Absensi Masuk',
      user: 'Budi',
      detail: 'Tepat Waktu',
      action: ''
    },
    { 
      timestamp: '2025-05-21 08:30',
      type: 'Penambahan Stok',
      user: 'Ani',
      detail: 'Beras +50kg',
      action: ''
    },
    { 
      timestamp: '2025-05-21 08:30',
      type: 'Absensi Keluar',
      user: 'Dedi',
      detail: 'Tepat waktu',
      action: ''
    },
    { 
      timestamp: '2025-05-21 08:30',
      type: 'Cetak Laporan',
      user: 'Mulyani',
      detail: 'Laporan Bulanan',
      action: ''
    },
    { 
      timestamp: '2025-05-21 08:30',
      type: 'Absensi Masuk',
      user: 'Doni',
      detail: 'Tepat waktu',
      action: ''
    }
  ];

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleActivityTypeChange = (e) => {
    setFilterActivityType(e.target.value);
  };

  const filteredActivities = activities.filter(activity => 
    filterActivityType ? activity.type === filterActivityType : true
  );

  const activityTypes = [...new Set(activities.map(a => a.type))];
  return (
    <div className="history-page">
      <Header title="Riwayat" />
      
      <div className="history-header">
        <h1>Riwayat</h1>
        <div className="header-actions">
          <button className="export-button">
            <FaDownload /> Unduh Excel
          </button>
          <button className="export-button">
            <FaDownload /> Unduh PDF
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="date-range-filter">
          <CustomDatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            monthsShown={2}
          />
        </div>

        <div className="activity-type-filter">
          <label>Jenis :</label>
          <select 
            value={filterActivityType}
            onChange={handleActivityTypeChange}
          >
            <option value="">Semua Aktivitas</option>
            {activityTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          <button className="filter-button">Filter</button>
        </div>
      </div>

      <div className="activities-section">
        <h2>Aktivitas Terbaru</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal & Waktu</th>
              <th>Jenis Aktivitas</th>
              <th>Pengguna</th>
              <th>Detail</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.timestamp}</td>
                <td>{activity.type}</td>
                <td>{activity.user}</td>
                <td>{activity.detail}</td>
                <td className="action-cell">{activity.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
