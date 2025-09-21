import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, user }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'recipes', label: 'Recipes', icon: '📖' },
    { id: 'ingredients', label: 'Ingredients', icon: '🥕' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'reactions', label: 'Reactions', icon: '❤️' },
     { id: 'comments', label: 'Comments', icon: '📖' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.name}</span>
            <span className="profile-role">{user?.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;