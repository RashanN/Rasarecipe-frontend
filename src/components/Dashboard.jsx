import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './dashboard/Sidebar';
import DashboardHome from './dashboard/DashboardHome';
import UserManagement from './dashboard/UserManagement';
import BlogManagement from './dashboard/BlogManagement';
import Analytics from './dashboard/Analytics';
import Settings from './dashboard/Settings';
import IngredientsManagement from './dashboard/IngredientsManagement';
import CategoriesManagement from './dashboard/CategoriesManagement';
import ReactionsManagement from './dashboard/ReactionsManagement';
import RecipesManagement from './dashboard/RecipesManagement';
import CommentsManagement from './dashboard/CommentsManagement';

import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
        case 'ingredients': 
      return <IngredientsManagement />;
        case 'categories': 
         return <CategoriesManagement />;
       case 'reactions': 
       return <ReactionsManagement />;
     case 'recipes':
        return <RecipesManagement />;
      case 'comments':
        return <CommentsManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={currentUser}
      />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {currentUser?.name}</span>
            <div className="user-avatar">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;