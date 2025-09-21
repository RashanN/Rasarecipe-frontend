import React, { useState } from 'react';
import './DashboardSections.css';

const BlogManagement = () => {
  const [blogs] = useState([
    { id: 1, title: 'Getting Started with React', author: 'John Doe', status: 'published', date: '2024-01-15', views: 1250 },
    { id: 2, title: 'Advanced JavaScript Tips', author: 'Jane Smith', status: 'draft', date: '2024-01-10', views: 890 },
    { id: 3, title: 'CSS Best Practices', author: 'Admin User', status: 'published', date: '2024-01-05', views: 2100 },
  ]);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Blog Management</h2>
        <p>Manage your blog posts and content</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.author}</td>
                <td>
                  <span className={`status-badge ${blog.status}`}>
                    {blog.status}
                  </span>
                </td>
                <td>{new Date(blog.date).toLocaleDateString()}</td>
                <td>{blog.views.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogManagement;