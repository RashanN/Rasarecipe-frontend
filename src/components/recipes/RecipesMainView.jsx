// src/components/recipes/RecipesMainView.jsx
import React, { useState, useEffect } from "react";
import recipesService from "../../services/recipesService";
import { Link } from "react-router-dom";
import "./RecipesMainView.css";

const RecipesMainView = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load recipes with pagination
  useEffect(() => {
    fetchRecipes();
    fetchSidebarData();
  }, [currentPage]);

  const fetchRecipes = async () => {
    try {
      const response = await recipesService.getAllRecipes(search);
      setRecipes(response.items || response); // handle paginated or simple
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchSidebarData = async () => {
    try {
      const cats = await recipesService.getCategories();
      setCategories(cats);
      const latest = await recipesService.getLatestRecipes(6);
      setLatestRecipes(latest);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecipes();
  };

  return (
    <div className="recipes-main-container">
      {/* HEADER */}
      <div className="recipes-header">
        <h1>RECIPES</h1>
      </div>

      {/* SEARCH */}
      <div className="recipes-search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Recipe"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>

      {/* MAIN CONTENT */}
      <div className="recipes-content">
        {/* RECIPE GRID */}
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipe/${recipe.slug}`}>
                <img
                  src={recipesService.getRecipeImageUrl(recipe.image)}
                  alt={recipe.name}
                />
              </Link>
              <div className="recipe-info">
                <h3>
                  <Link to={`/recipe/${recipe.slug}`}>{recipe.name}</Link>
                </h3>
                <p>{recipe.categories?.map((c) => c.name).join(", ")}</p>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="recipes-sidebar">
          <div className="sidebar-section">
            <h3>Latest Recipes</h3>
            <ul>
              {latestRecipes.map((r) => (
                <li key={r.id}>
                  <Link to={`/recipe/${r.slug}`}>{r.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Recipe Categories</h3>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecipesMainView;
