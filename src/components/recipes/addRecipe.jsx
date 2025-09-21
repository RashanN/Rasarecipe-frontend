import React, { useEffect, useState } from "react";
import recipesService from "../../services/recipesService";
import ingredientsService from "../../services/ingredientsService";
import categoriesService from "../../services/categoriesService";
import { useNavigate } from "react-router-dom";
import "./AddRecipe.css";
import Footer from "../Footer";


const AddRecipe = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState(null);

  // Ingredients & Categories
  const [ingredientsList, setIngredientsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ing = await ingredientsService.getAllIngredients();
        setIngredientsList(ing);

        const cat = await categoriesService.getAllCategories();
        setCategoriesList(cat);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // Handle ingredient selection
  const handleIngredientChange = (ingredientId, quantity) => {
    setSelectedIngredients((prev) => {
      const existing = prev.find((i) => i.ingredientId === ingredientId);
      if (existing) {
        return prev.map((i) =>
          i.ingredientId === ingredientId ? { ...i, quantity } : i
        );
      } else {
        return [...prev, { ingredientId, quantity }];
      }
    });
  };

  // Handle category selection
  const handleCategoryChange = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name,
        content,
        preparationTime: prepTime,
        cookingTime,
        servings,
        image,
        ingredients: selectedIngredients,
        categories: selectedCategories,
      };

      const response = await recipesService.createRecipe(payload);
      navigate(`/recipe/${response.slug}`);
    } catch (err) {
      setError(err.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero1-section">
        <div className="hero1-overlay"></div>
        <div className="hero1-content">
          <h1>Create Your Culinary Masterpiece</h1>
          <p>Share your unique recipe with the world</p>
          <button
            onClick={() => document.getElementById("form-section").scrollIntoView({ behavior: "smooth" })}
            className="hero1-button"
          >
            Start Creating
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Form Section */}
        <div id="form-section" className="form-container">
          <h2>Add Your Recipe</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="recipe-form">
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder=" "
              />
              <label className="form-label">Recipe Name</label>
            </div>

            <div className="form-group">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="form-input"
                placeholder=" "
              ></textarea>
              <label className="form-label">Description / Method</label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="form-input"
                  placeholder=" "
                />
                <label className="form-label">Prep Time (min)</label>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="form-input"
                  placeholder=" "
                />
                <label className="form-label">Cooking Time (min)</label>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="form-input"
                  placeholder=" "
                />
                <label className="form-label">Servings</label>
              </div>
            </div>

            <div className="upload-box">
              <input
                type="file"
                id="image-upload"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input"
              />
              <label htmlFor="image-upload" className="upload-label">
                📷 Upload Recipe Image
              </label>
            </div>

            <div>
              <h4>Ingredients</h4>
              <div className="pill-list custom-scrollbar">
                {ingredientsList.map((ing) => (
                  <div key={ing.id} className="ingredient-item">
                    <label className="pill">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleIngredientChange(ing.id, e.target.checked ? 1 : 0)
                        }
                        className="pill-checkbox"
                      />
                      <span>{ing.name}</span>
                    </label>
                    {selectedIngredients.find((i) => i.ingredientId === ing.id) && (
                      <input
                        type="text"
                        min="1"
                        placeholder="Qty"
                        value={
                          selectedIngredients.find((i) => i.ingredientId === ing.id)?.quantity || ""
                        }
                        onChange={(e) =>
                          handleIngredientChange(ing.id, parseInt(e.target.value))
                        }
                        className="quantity-input"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4>Categories</h4>
              <div className="pill-list">
                {categoriesList.map((cat) => (
                  <label key={cat.id} className="pill">
                    <input
                      type="checkbox"
                      onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                      className="pill-checkbox"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? "Saving..." : "➕ Add Recipe"}
            </button>
          </form>
        </div>

        {/* Sideview */}
        <div className="sideview">
          <div className="sideview-card">
            <h4>Explore Categories</h4>
            <ul>
              {categoriesList.map((cat) => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </div>
          <div className="sideview-card">
            <img
              src="/Uploads/web/Nutriline-Web-Banner-370x442px-FAOL-01.jpg"
              alt="sideview Banner"
              className="sideview-image"
            />
          </div>
          <div className="sideview-card">
            <img
              src="/Uploads/web/THUMBNAILENGLISH (1).jpg"
              alt="sideview Banner"
              className="sideview-image"
            />
          </div>
        </div>
      </div>

    <Footer />
      
    </div>
  );
};

export default AddRecipe;