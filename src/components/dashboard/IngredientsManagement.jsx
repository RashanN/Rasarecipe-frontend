import React, { useState, useEffect } from 'react';
import ingredientsService from '../../services/ingredientsService';
import './DashboardSections.css';

const IngredientsManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadIngredients();
  }, [searchTerm]);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsService.getAllIngredients(searchTerm);
      setIngredients(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIngredient) {
        await ingredientsService.updateIngredient(editingIngredient.id, formData);
        alert('Ingredient updated successfully!');
      } else {
        await ingredientsService.createIngredient(formData);
        alert('Ingredient created successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingIngredient(null);
      loadIngredients();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      description: ingredient.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await ingredientsService.deleteIngredient(id);
        alert('Ingredient deleted successfully!');
        loadIngredients();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingIngredient(null);
    setShowModal(false);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Ingredients Management</h2>
        <p>Manage your recipe ingredients</p>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add New Ingredient
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading ingredients...</div>
      ) : (
        <div className="table-container">
          {ingredients.length === 0 ? (
            <div className="empty-state">
              <p>No ingredients found</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td>
                      <strong>{ingredient.name}</strong>
                    </td>
                    <td>
                      {ingredient.description || 'No description'}
                    </td>
                    <td>
                      {new Date(ingredient.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(ingredient)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(ingredient.id, ingredient.name)}
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
              <h3>{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter ingredient name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter ingredient description (optional)"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingIngredient ? 'Update' : 'Create'} Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsManagement;