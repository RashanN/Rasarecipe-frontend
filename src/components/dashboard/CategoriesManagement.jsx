import React, { useState, useEffect } from 'react';
import categoriesService from '../../services/categoriesService';
import './DashboardSections.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAllCategories(searchTerm);
      setCategories(data);
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

      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, data);
        alert('Category updated successfully!');
      } else {
        await categoriesService.createCategory(data);
        alert('Category created successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', image: null });
      setImagePreview('');
      setEditingCategory(null);
      setError('');
      loadCategories();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: null,
    });
    setImagePreview(category.image ? `http://localhost:3000/${category.image}` : '');
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await categoriesService.deleteCategory(id);
        alert('Category deleted successfully!');
        loadCategories();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: null });
    setImagePreview('');
    setEditingCategory(null);
    setShowModal(false);
    setError('');
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Categories Management</h2>
        <p>Manage your product categories</p>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New Category
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="table-container">
          {categories.length === 0 ? (
            <div className="empty-state">
              <p>No categories found</p>
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      {category.image ? (
                        <img
                          src={`http://localhost:3000/${category.image}`}
                          alt={category.name}
                          className="category-image"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </td>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(category)}>
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(category.id, category.name)}
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
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
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
                  placeholder="Enter category name"
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
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;