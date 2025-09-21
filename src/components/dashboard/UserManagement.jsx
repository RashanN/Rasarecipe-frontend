import React, { useState, useEffect } from 'react';
import './DashboardSections.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, you'd fetch from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'author', status: 'active', joined: '2024-01-10' },
        { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joined: '2024-01-05' },
        { id: 4, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', joined: '2024-01-20' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditUser = (userId) => {
    alert(`Edit user with ID: ${userId}`);
    // In real app: open edit modal or navigate to edit page
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      alert(`Delete user with ID: ${userId}`);
      // In real app: call API to delete user
    }
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="section-header">
          <h2>User Management</h2>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>User Management</h2>
        <p>Manage your users and their permissions</p>
      </div>

      <div className="table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar-small">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.joined).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditUser(user.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;