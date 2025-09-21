
import React, { useEffect, useState } from 'react';
import recipesService from '../../services/recipesService';
import ingredientsService from '../../services/ingredientsService';
import categoriesService from '../../services/categoriesService';
import './DashboardSections.css';

const RecipesManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    content: '',
    image: '',
    cookingTime: '',
    ingredients: [], // [{ingredientId, quantity}]
    categories: [],
  });

  useEffect(() => {
    loadAll();
    loadIngredients();
    loadCategories();
  }, []);

  // Load all recipes from database with search
  const loadAll = async (search = '') => {
    setLoading(true);
    try {
      const data = await recipesService.getAllRecipes(search);
      setRecipes(data);
    } catch (err) {
      console.error('Error loading recipes:', err);
      alert(err.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  // Load ingredients from database for multiple select with search
  const loadIngredients = async (search = '') => {
    try {
      const data = await ingredientsService.getAllIngredients(search);
      setIngredientsList(data);
    } catch (err) {
      console.error('Error loading ingredients:', err);
    }
  };

  // Load categories from database for multiple select with search
  const loadCategories = async (search = '') => {
    try {
      const data = await categoriesService.getAllCategories(search);
      setCategoriesList(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Handle main recipe search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadAll(value); // Search recipes in real-time
  };

  // Handle ingredient search in modal
  const handleIngredientSearch = (e) => {
    const value = e.target.value;
    setIngredientSearch(value);
    loadIngredients(value); // Search ingredients in real-time
  };

  // Handle category search in modal
  const handleCategorySearch = (e) => {
    const value = e.target.value;
    setCategorySearch(value);
    loadCategories(value); // Search categories in real-time
  };

  // Open create modal
  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    setImagePreview('');
    setIngredientSearch('');
    setCategorySearch('');
    setForm({
      name: '',
      content: '',
      image: '',
      cookingTime: '',
      ingredients: [],
      categories: [],
    });
    setShowModal(true);
    // Reload ingredients and categories for modal
    loadIngredients();
    loadCategories();
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setForm({...form, image: ''});
    }
  };

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setForm({...form, image: url});
    if (url) {
      setImagePreview(url);
      setImageFile(null); // Clear file when URL is entered
    } else {
      setImagePreview('');
    }
  };

  // Your existing ingredient toggle function - handles multiple ingredients selection
  const handleIngredientToggle = (ing) => {
    const exists = form.ingredients.find(i => i.ingredientId === ing.id);
    if (exists) {
      setForm({
        ...form,
        ingredients: form.ingredients.filter(i => i.ingredientId !== ing.id)
      });
    } else {
      setForm({
        ...form,
        ingredients: [...form.ingredients, { ingredientId: ing.id, quantity: '' }]
      });
    }
  };

  // Your existing ingredient quantity function
  const setIngredientQty = (ingredientId, qty) => {
    setForm({
      ...form,
      ingredients: form.ingredients.map(i => i.ingredientId === ingredientId ? { ...i, quantity: qty } : i)
    });
  };

  // Your existing category toggle function - handles multiple categories selection
  const toggleCategory = (catId) => {
    if (form.categories.includes(catId)) {
      setForm({ ...form, categories: form.categories.filter(c => c !== catId) });
    } else {
      setForm({ ...form, categories: [...form.categories, catId] });
    }
  };

  // Your existing submit function - saves to multiple tables
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        content: form.content,
        cookingTime: Number(form.cookingTime) || null,
        categories: form.categories, // Saves to recipe_categories table
        ingredients: form.ingredients // Saves to recipe_ingredients table with quantities
      };

      // Handle image - either file upload or URL
      if (imageFile) {
        payload.image = imageFile; // File upload to uploads/ folder
      } else if (form.image) {
        payload.image = form.image; // URL
      }

      if (editing) {
        await recipesService.updateRecipe(editing.id, payload);
        alert('Recipe updated successfully!');
      } else {
        await recipesService.createRecipe(payload);
        alert('Recipe created successfully!');
      }
      setShowModal(false);
      loadAll(searchTerm); // Reload with current search
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert(err.message || 'Error saving recipe');
    }
  };

  // Your existing edit function - loads data from multiple tables
  const handleEdit = async (r) => {
    try {
      const res = await recipesService.getRecipeById(r.id);
      setEditing(res);
      setImageFile(null);
      setIngredientSearch('');
      setCategorySearch('');
      
      // Set image preview - handle both uploaded files and URLs
      if (res.image) {
        if (res.image.startsWith('/uploads/')) {
          setImagePreview(`http://localhost:3000${res.image}`);
        } else {
          setImagePreview(res.image);
        }
      } else {
        setImagePreview('');
      }
      
      setForm({
        name: res.name,
        content: res.content,
        image: res.image && !res.image.startsWith('/uploads/') ? res.image : '',
        cookingTime: res.cookingTime || '',
        // Load ingredients from recipe_ingredients table
        ingredients: (res.recipeIngredients || []).map(ri => ({ 
          ingredientId: ri.ingredient.id, 
          quantity: ri.quantity || '' 
        })),
        // Load categories from recipe_categories table
        categories: (res.recipeCategories || []).map(rc => rc.category.id)
      });
      
      // Load all ingredients and categories for editing
      await loadIngredients();
      await loadCategories();
      
      setShowModal(true);
    } catch (err) {
      console.error('Error loading recipe:', err);
      alert(err.message || 'Failed to load recipe');
    }
  };

  // Your existing delete function
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await recipesService.deleteRecipe(id);
      alert('Recipe deleted successfully!');
      loadAll(searchTerm); // Reload with current search
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert(err.message || 'Delete failed');
    }
  };

  // Your existing approve function
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this recipe?')) return;
    try {
      await recipesService.approveRecipe(id);
      alert('Recipe approved successfully!');
      loadAll(searchTerm); // Reload with current search
    } catch (err) {
      console.error('Error approving recipe:', err);
      alert(err.message || 'Approve failed');
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Recipes Management</h2>
        <p>Create, edit and approve recipes</p>
      </div>

      <div className="controls-row">
        <button className="btn-primary" onClick={openCreate}>+ Add New Recipe</button>
      </div>

      {loading ? <div>Loading recipes...</div> : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Author</th>
                <th>Ingredients</th>
                <th>Categories</th>
                <th>Approved</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(r => (
                <tr key={r.id}>
                  <td>
                    {r.image ? (
                      <img 
                        src={r.image.startsWith('/uploads/') ? `http://localhost:3000${r.image}` : r.image}
                        alt={r.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '4px', 
                      display: r.image ? 'none' : 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      No Image
                    </div>
                  </td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.author?.name || '—'}</td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {(r.recipeIngredients || []).slice(0, 2).map(ri => 
                        <div key={ri.ingredient.id}>{ri.ingredient.name}</div>
                      )}
                      {(r.recipeIngredients || []).length > 2 && 
                        <div>+{(r.recipeIngredients || []).length - 2} more</div>
                      }
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      {(r.recipeCategories || []).map(rc => rc.category.name).join(', ')}
                    </div>
                  </td>
                  <td>{r.isApproved ? 'Yes' : 'No'}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(r)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(r.id)}>Delete</button>
                    {!r.isApproved && <button className="btn-primary" onClick={() => handleApprove(r.id)}>Approve</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Recipe' : 'Create Recipe'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea 
                  rows="4" 
                  required 
                  value={form.content} 
                  onChange={(e) => setForm({...form, content: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <div style={{ marginBottom: '10px' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    Upload image file (saves to uploads/ folder)
                  </div>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <input 
                    type="url"
                    placeholder="Or enter image URL (e.g., https://example.com/image.jpg)" 
                    value={form.image} 
                    onChange={handleImageUrlChange}
                  />
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Or paste an image URL
                  </div>
                </div>
                
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Preview:</div>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none', color: '#999', fontSize: '12px', marginTop: '5px' }}>
                      Failed to load image
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Cooking Time (minutes)</label>
                <input 
                  type="number" 
                  value={form.cookingTime} 
                  onChange={(e) => setForm({...form, cookingTime: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label>Ingredients (Multiple Selection)</label>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                  Select ingredients from database and set quantities:
                </div>
                <div className="ingredients-list" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                  {ingredientsList.map(ing => {
                    const sel = form.ingredients.find(i => i.ingredientId === ing.id);
                    return (
                      <div key={ing.id} className="ingredient-row" style={{ marginBottom: '8px', padding: '5px', backgroundColor: sel ? '#f0f8ff' : 'transparent', borderRadius: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          <input 
                            type="checkbox" 
                            checked={!!sel} 
                            onChange={() => handleIngredientToggle(ing)} 
                            style={{ marginRight: '8px' }}
                          /> 
                          <strong>{ing.name}</strong>
                          {ing.description && <span style={{ fontSize: '11px', color: '#666', marginLeft: '8px' }}>({ing.description})</span>}
                        </label>
                        {sel && (
                          <input
                            type="text"
                            placeholder="Quantity (e.g. 2 cups, 1 kg, 3 pieces)"
                            value={sel.quantity}
                            onChange={(e) => setIngredientQty(ing.id, e.target.value)}
                            style={{ width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '12px' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                  Selected: {form.ingredients.length} ingredient(s)
                </div>
              </div>

              <div className="form-group">
                <label>Categories (Multiple Selection)</label>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                  Select categories from database:
                </div>
                <div className="categories-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                  {categoriesList.map(c => (
                    <label key={c.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '5px 10px', 
                      backgroundColor: form.categories.includes(c.id) ? '#e8f5e8' : '#f9f9f9',
                      border: form.categories.includes(c.id) ? '2px solid #4CAF50' : '1px solid #ddd',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={form.categories.includes(c.id)} 
                        onChange={() => toggleCategory(c.id)} 
                        style={{ marginRight: '5px' }}
                      /> 
                      {c.name}
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                  Selected: {form.categories.length} categor{form.categories.length === 1 ? 'y' : 'ies'}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <strong>Database Tables:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li>Recipe data → <code>recipes</code> table</li>
                  <li>Selected ingredients → <code>recipe_ingredients</code> table</li>
                  <li>Selected categories → <code>recipe_categories</code> table</li>
                  <li>Image files → <code>uploads/</code> folder</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{editing ? 'Update Recipe' : 'Create Recipe'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesManagement;