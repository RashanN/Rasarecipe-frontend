import React, { useState, useEffect } from 'react';
import reactionsService from '../../services/reactionsService';
import './DashboardSections.css';

const ReactionsManagement = () => {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReaction, setEditingReaction] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReactions();
  }, [searchTerm]);

  const loadReactions = async () => {
    try {
      setLoading(true);
      const data = await reactionsService.getAllReactions(searchTerm);
      setReactions(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, JPG, PNG, and GIF images are allowed');
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      const trimmedName = formData.name.trim();
      
      data.append('name', trimmedName);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingReaction) {
        await reactionsService.updateReaction(editingReaction.id, data);
        alert('Reaction updated successfully!');
      } else {
        await reactionsService.createReaction(data);
        alert('Reaction created successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', image: null });
      setImagePreview('');
      setEditingReaction(null);
      setError('');
      loadReactions();
    } catch (error) {a
      setError(error.message);
    }
  };

  const handleEdit = (reaction) => {
    setEditingReaction(reaction);
    setFormData({
      name: reaction.name,
      image: null,
    });
    setImagePreview(reaction.image ? `http://localhost:3000/${reaction.image}` : '');
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await reactionsService.deleteReaction(id);
        alert('Reaction deleted successfully!');
        loadReactions();a
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: null });
    setImagePreview('');
    setEditingReaction(null);
    setShowModal(false);
    setError('');
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Reactions Management</h2>
        <p>Manage your reactions</p>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Reaction
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading reactions...</div>
      ) : (
        <div className="table-container">
          {reactions.length === 0 ? (
            <div className="empty-state">
              <p>No reactions found</p>
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reactions.map((reaction) => (
                  <tr key={reaction.id}>
                    <td>
                      {reaction.image ? (
                        <img
                          src={`http://localhost:3000/${reaction.image}`}
                          alt={reaction.name}
                          className="reaction-image"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </td>
                    <td>
                      <strong>{reaction.name}</strong>
                    </td>
                    <td>{new Date(reaction.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(reaction)}>
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(reaction.id, reaction.name)}
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
              <h3>{editingReaction ? 'Edit Reaction' : 'Add New Reaction'}</h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form" encType="multipart/form-data">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter reaction name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image (optional - JPEG, JPG, PNG, GIF only)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingReaction ? 'Update' : 'Create'} Reaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionsManagement;