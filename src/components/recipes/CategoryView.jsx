// src/components/recipes/CategoryView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import recipeService from "../../services/recipesService";
import "./CategoryView.css";

const CategoryView = () => {
  const { id } = useParams(); // category id from URL
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category info
        const cats = await recipeService.getCategories();
        setCategories(cats);
        const current = cats.find((c) => c.id === parseInt(id));
        setCategory(current);

        // Fetch recipes for category with pagination
        const response = await recipeService.getRecipesByCategory(id, 10, page, search);
        setRecipes(response.items || response); // adjust if backend sends {items, totalPages}
        setTotalPages(response.totalPages || 1);

        // Fetch latest recipes
        const latest = await recipeService.getLatestRecipes(5);
        setLatestRecipes(latest);
      } catch (err) {
        console.error("Failed to load category view", err);
      }
    };
    fetchData();
  }, [id, page, search]);

  return (
    <div className="category-view">
      {/* Header */}
      <header className="category-header">
        <div className="overlay">
          <h1>{category ? category.name : "Category"}</h1>
        
        </div>
      </header>

      <div className="category-container">
        {/* Main Recipes */}
        <div className="recipes-list">
          {recipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img
                  src={recipeService.getRecipeImageUrl(recipe.image)}
                  alt={recipe.name}
                />
                <h3>
                  <Link to={`/recipe/${recipe.slug}`}>{recipe.name}</Link>
                </h3>
                <p>{recipe.cookingTime} mins</p>
              </div>
            ))
          )}

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sideview">
          <section className="latest-recipes">
            <h2>Latest Recipes</h2>
            {latestRecipes.map((r) => (
              <div key={r.id} className="latest-item">
                <img
                  src={recipeService.getRecipeImageUrl(r.image)}
                  alt={r.name}
                />
                <Link to={`/recipe/${r.slug}`}>{r.name}</Link>
              </div>
            ))}
          </section>

          <section className="sideview-card ">
            <h2>Categories</h2>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CategoryView;
