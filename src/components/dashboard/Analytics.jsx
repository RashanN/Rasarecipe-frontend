import React from 'react';
import './DashboardSections.css';

const Analytics = () => {
  const analyticsData = {
    visitors: { total: 12500, change: '+12%' },
    pageViews: { total: 45600, change: '+8%' },
    bounceRate: { total: '32%', change: '-5%' },
    avgSession: { total: '4m 32s', change: '+2%' }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Analytics</h2>
        <p>Website performance and user statistics</p>
      </div>

      <div className="stats-grid">
        {Object.entries(analyticsData).map(([key, data]) => (
          <div key={key} className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{data.total}</h3>
              <p>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
              <span className={`stat-change ${data.change.includes('+') ? 'positive' : 'negative'}`}>
                {data.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Traffic Overview</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">👥</span>
            <div className="activity-content">
              <p>Most visitors from United States</p>
              <span className="activity-time">45% of total traffic</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📱</span>
            <div className="activity-content">
              <p>Mobile traffic increased by 15%</p>
              <span className="activity-time">62% mobile users</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🔍</span>
            <div className="activity-content">
              <p>Top search term: "React tutorials"</p>
              <span className="activity-time">1,250 searches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;