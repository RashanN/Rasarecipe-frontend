import React from 'react';
import './DashboardSections.css';
import Footer from '../Footer';

const DashboardHome = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: '👥', change: '+12%' },
    { label: 'Total Posts', value: '567', icon: '📝', change: '+8%' },
    { label: 'Comments', value: '2,890', icon: '💬', change: '+5%' },
    { label: 'Page Views', value: '45.6K', icon: '👀', change: '+23%' },
  ];

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome to your admin dashboard</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <span className="stat-change positive">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <div className="activity-content">
              <p>New user registered</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📝</span>
            <div className="activity-content">
              <p>Blog post published</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💬</span>
            <div className="activity-content">
              <p>New comment received</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  );
};

export default DashboardHome;