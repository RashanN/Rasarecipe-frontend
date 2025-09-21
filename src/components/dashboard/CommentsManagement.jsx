import React, { useState, useEffect } from 'react';
import commentService from '../../services/commentService';
import './DashboardSections.css';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    recipeSlug: '', // Add recipe selection for new comments
  });
  const [error, setError] = useState('');
  const [recipes, setRecipes] = useState([]); // For recipe selection dropdown

  useEffect(() => {
    loadComments();
    // You might want to load available recipes for the dropdown
    // loadRecipes();
  }, [searchTerm]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getAllComments(searchTerm);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Load recipes for dropdown (you'll need to implement this service method)
  // const loadRecipes = async () => {
  //   try {
  //     const recipesData = await recipeService.getAllRecipes();
  //     setRecipes(recipesData);
  //   } catch (error) {
  //     console.error('Error loading recipes:', error);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const trimmedContent = formData.content.trim();
      
      if (!trimmedContent) {
        setError('Content is required');
        return;
      }

      if (editingComment) {
        await commentService.updateComment(editingComment.id, { content: trimmedContent });
        alert('Comment updated successfully!');
      } else {
        // For new comments, you need a recipe slug
        if (!formData.recipeSlug) {
          setError('Please select a recipe for the new comment');
          return;
        }
        await commentService.createComment(formData.recipeSlug, { content: trimmedContent });
        alert('Comment created successfully!');
      }
      
      setShowModal(false);
      setFormData({ content: '', recipeSlug: '' });
      setEditingComment(null);
      setError('');
      loadComments();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setFormData({
      content: comment.content,
      recipeSlug: comment.recipe_slug || '',
    });
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id, content) => {
    if (window.confirm(`Are you sure you want to delete this comment?`)) {
      try {
        await commentService.deleteComment(id);
        alert('Comment deleted successfully!');
        loadComments();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await commentService.approveComment(id);
      alert('Comment approved successfully!');
      loadComments();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({ content: '', recipeSlug: '' });
    setEditingComment(null);
    setShowModal(false);
    setError('');
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Comments Management</h2>
        <p>Manage your comments</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Comment
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading comments...</div>
      ) : (
        <div className="table-container">
          {comments.length === 0 ? (
            <div className="empty-state">
              <p>No comments found</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="btn-secondary">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Recipe</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>
                      <span className="comment-preview">
                        {comment.content.length > 50 
                          ? comment.content.substring(0, 50) + '...' 
                          : comment.content}
                      </span>
                    </td>
                    <td>{comment.recipe_slug || 'N/A'}</td>
                    <td>{comment.author_name || 'Anonymous'}</td>
                    <td>
                      <span className={`status ${comment.isApproved ? 'approved' : 'pending'}`}>
                        {comment.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(comment)}>
                          Edit
                        </button>
                        {!comment.isApproved && (
                          <button className="btn-approve" onClick={() => handleApprove(comment.id)}>
                            Approve
                          </button>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(comment.id, comment.content)}
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
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingComment ? 'Edit Comment' : 'Add New Comment'}</h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}
              
              {!editingComment && (
                <div className="form-group">
                  <label htmlFor="recipeSlug">Recipe Slug *</label>
                  <input
                    type="text"
                    id="recipeSlug"
                    name="recipeSlug"
                    value={formData.recipeSlug}
                    onChange={handleInputChange}
                    placeholder="Enter recipe slug (e.g., chocolate-cake)"
                    required
                  />
                  <small>Enter the recipe slug where this comment will be posted</small>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter comment content"
                  required
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingComment ? 'Update' : 'Create'} Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsManagement;