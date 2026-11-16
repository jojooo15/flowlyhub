import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaUsers, FaClock, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/AttendanceStats.css';

const AttendanceStats = ({ stats, showDetailed = false }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalRecords: 0,
    onTimeRecords: 0,
    lateRecords: 0,
    onTimePercentage: 0,
    latePercentage: 0
  });

  useEffect(() => {
    if (stats && stats.summary) {
      // Animate numbers
      const timeout = setTimeout(() => {
        setAnimatedStats(stats.summary);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [stats]);

  if (!stats || !stats.summary) {
    return (
      <div className="attendance-stats">
        <div className="stats-grid">
          <div className="stat-card loading">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Loading...</h3>
              <p>Total Kehadiran</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { summary } = stats;

  return (
    <div className="attendance-stats">
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{animatedStats.totalRecords}</h3>
            <p>Total Kehadiran</p>
          </div>
        </div>

        <div className="stat-card on-time">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>{animatedStats.onTimeRecords}</h3>
            <p>Tepat Waktu ({animatedStats.onTimePercentage}%)</p>
          </div>
        </div>

        <div className="stat-card late">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{animatedStats.lateRecords}</h3>
            <p>Terlambat ({animatedStats.latePercentage}%)</p>
          </div>
        </div>

        {showDetailed && (
          <div className="stat-card performance">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{animatedStats.onTimePercentage}%</h3>
              <p>Tingkat Kehadiran</p>
            </div>
          </div>
        )}
      </div>

      {showDetailed && summary.onTimePercentage && (
        <div className="performance-indicator">
          <div className="performance-bar">
            <div 
              className="performance-fill"
              style={{ width: `${summary.onTimePercentage}%` }}
            />
          </div>
          <div className="performance-text">
            Performance: {summary.onTimePercentage >= 90 ? 'Excellent' : 
                        summary.onTimePercentage >= 75 ? 'Good' : 
                        summary.onTimePercentage >= 60 ? 'Fair' : 'Needs Improvement'}
          </div>
        </div>
      )}
    </div>
  );
};

AttendanceStats.propTypes = {
  stats: PropTypes.shape({
    summary: PropTypes.shape({
      totalRecords: PropTypes.number,
      onTimeRecords: PropTypes.number,
      lateRecords: PropTypes.number,
      onTimePercentage: PropTypes.number,
      latePercentage: PropTypes.number
    })
  }),
  showDetailed: PropTypes.bool
};

export default AttendanceStats;
