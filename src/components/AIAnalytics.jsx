import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/AIAnalytics.css';

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, inventoryResponse] = await Promise.all([
        api.ai.getSalesAnalytics('30d'),
        api.ai.optimizeInventory()
      ]);

      setAnalytics(analyticsResponse.data);
      setInventory(inventoryResponse.data);
    } catch (error) {
      console.error('Error fetching AI data:', error);
      setError('Failed to load AI analytics');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'restock': return '📈';
      case 'reduce': return '📉';
      case 'optimize': return '⚡';
      default: return '💡';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error-color)';
      case 'medium': return 'var(--warning-color)';
      case 'low': return 'var(--success-color)';
      default: return 'var(--info-color)';
    }
  };

  if (loading) {
    return (
      <div className="ai-analytics">
        <div className="ai-analytics-header">
          <h2>🤖 AI Analytics</h2>
          <p>Intelligent insights for your business</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-analytics">
        <div className="ai-analytics-header">
          <h2>🤖 AI Analytics</h2>
          <p>Intelligent insights for your business</p>
        </div>
        <div className="ai-error">
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={fetchAIData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-analytics">
      <div className="ai-analytics-header">
        <h2>🤖 AI Analytics</h2>
        <p>Intelligent insights powered by machine learning</p>
      </div>

      <div className="ai-grid">
        {/* Sales Analytics */}
        <div className="ai-card">
          <div className="ai-card-header">
            <h3>📊 Sales Insights</h3>
            <span className="ai-badge">ML Powered</span>
          </div>
          <div className="ai-metrics">
            <div className="metric">
              <span className="metric-value">
                {analytics?.totalSales?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }) || 'N/A'}
              </span>
              <span className="metric-label">Total Sales (30d)</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {analytics?.growthRate || 'N/A'}%
              </span>
              <span className="metric-label">Growth Rate</span>
            </div>
          </div>
          <div className="ai-trend">
            <div className="trend-chart">
              📈 Trending upward based on historical patterns
            </div>
          </div>
        </div>

        {/* Inventory Optimization */}
        <div className="ai-card">
          <div className="ai-card-header">
            <h3>📦 Smart Inventory</h3>
            <span className="ai-badge">Auto-Optimized</span>
          </div>
          <div className="ai-metrics">
            <div className="metric">
              <span className="metric-value">{inventory?.totalItems || 0}</span>
              <span className="metric-label">Total Items</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {inventory?.totalValue?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }) || 'N/A'}
              </span>
              <span className="metric-label">Total Value</span>
            </div>
          </div>
          <div className="inventory-alerts">
            {inventory?.recommendations?.slice(0, 3).map((rec, index) => (
              <div key={index} className="alert-item">
                <span className="alert-icon">{getRecommendationIcon(rec.type)}</span>
                <span className="alert-text">{rec.message}</span>
                <span 
                  className="alert-priority"
                  style={{ color: getPriorityColor(rec.priority) }}
                >
                  {rec.priority}
                </span>
              </div>
            )) || (
              <div className="alert-item">
                <span className="alert-icon">✅</span>
                <span className="alert-text">Inventory levels are optimal</span>
              </div>
            )}
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="ai-card ai-card-full">
          <div className="ai-card-header">
            <h3>🔮 Demand Forecast</h3>
            <span className="ai-badge">Predictive AI</span>
          </div>
          <div className="forecast-categories">
            {Object.entries(inventory?.categories || {}).map(([category, data]) => (
              <div key={category} className="forecast-item">
                <div className="forecast-header">
                  <span className="category-name">{category}</span>
                  <span className="category-value">
                    {data.totalValue?.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    })}
                  </span>
                </div>
                <div className="forecast-bar">
                  <div 
                    className="forecast-fill"
                    style={{ 
                      width: `${Math.min((data.totalValue / inventory.totalValue) * 100, 100)}%`,
                      backgroundColor: data.lowStock > 0 ? 'var(--warning-color)' : 'var(--success-color)'
                    }}
                  ></div>
                </div>
                <div className="forecast-details">
                  <span className="detail-item">
                    {data.items} items
                  </span>
                  {data.lowStock > 0 && (
                    <span className="detail-item warning">
                      {data.lowStock} low stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actions */}
        <div className="ai-actions">
          <h3>🎯 Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => window.location.href = '/products'}
            >
              📦 Manage Inventory
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => window.location.href = '/reports'}
            >
              📊 View Reports
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={fetchAIData}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
