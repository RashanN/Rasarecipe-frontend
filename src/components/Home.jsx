import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import recipesService from '../services/recipesService';
import { Clock, User, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './Home.css';
import Footer from "../components/Footer";

const Home = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock data for hero section (you can replace with dynamic data later)
  const heroSlides = [
    {
      id: 1,
      title: 'Noodles Kottu',
      subtitle: 'Traditional Sri Lankan Recipes',
      image: '/uploads/web/Banner2-1-1.png',
      button: 'Read More'
    },
    {
      id: 2,
      title: 'Authentic Flavors of Sri Lanka',
      subtitle: 'Discover Traditional Recipes',
      image: '/uploads/web/Banner1.png',
      button: 'Explore Recipes'
    }
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [categoriesData, recipesData] = await Promise.all([
        recipesService.getCategories(),
        recipesService.getLatestRecipes(12)
      ]);

      setCategories(categoriesData.slice(0, 6)); // Limit to 6 categories
      setLatestRecipes(recipesData);
      setFeaturedRecipes(recipesData.slice(0, 6)); // Use first 6 as featured
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading delicious recipes...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="container">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <button className="hero-button">{slide.button}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Navigation */}
        <button className="hero-nav hero-nav-prev" onClick={prevSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="hero-nav hero-nav-next" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>

        {/* Hero Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="category-card"
              >
                <div className="category-icon">
                  <img
                    src={recipesService.getImageUrl(category.image)}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80';
                    }}
                  />
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="video-section">
        <div className="container">
          <div className="video-grid">
            <div className="video-card">
              <div className="video-thumbnail">
                <img src="/uploads/web/THUMBNAILENGLISH.jpg" alt="How to Upload a Recipe" />
                <div className="video-play">
                  <Play size={24} />
                </div>
              </div>
              <h3>HOW TO UPLOAD A RASA RECIPE</h3>
            </div>
            <div className="video-card">
              <div className="video-thumbnail">
                <img src="/uploads/web/THUMBNAILSINHALA.jpg" alt="Recipe Upload Guide" />
                <div className="video-play">
                  <Play size={24} />
                </div>
              </div>
              <h3> UPLOAD කරන්නේ කොහොමද?</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Recipes</h2>
            <p>Explore culinary trends with our trending recipes - discover the latest flavors and techniques in the spotlight.</p>
          </div>

          <div className="trending-grid">
            {/* Featured Recipe */}
            <div className="featured-recipe">
              {featuredRecipes[0] && (
                <Link to={`/recipe/${featuredRecipes[0].slug}`} className="featured-card">
                  <div className="featured-image">
                    <img
                      src={recipesService.getImageUrl(featuredRecipes[0].image)}
                      alt={featuredRecipes[0].name}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/300';
                      }}
                    />
                    <div className="featured-overlay">
                      <div className="featured-badge">Featured</div>
                      <h3>{featuredRecipes[0].name}</h3>
                      <div className="recipe-meta">
                        <span><Clock size={16} /> {formatTime(featuredRecipes[0].cooking_time)}</span>
                        <span><User size={16} /> By Chef</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Recipe Grid */}
            <div className="recipes-grid">
              {latestRecipes.slice(0, 6).map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.slug}`}
                  className="recipe-card"
                >
                  <div className="recipe-image">
                    <img
                      src={recipesService.getImageUrl(recipe.image)}
                      alt={recipe.name}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/250/200';
                      }}
                    />
                  </div>
                  <div className="recipe-content">
                    <h4>{recipe.name}</h4>
                    <div className="recipe-meta">
                      <span><Clock size={14} /> {formatTime(recipe.cooking_time)}</span>
                      <div className="recipe-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className="star" />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Recipes Section */}
      <section className="latest-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Recipe</h2>
          </div>

          <div className="latest-sidebar-layout">
            {/* Main Recipes */}
            <div className="latest-main">
              <div className="latest-grid">
                {latestRecipes.slice(0, 4).map((recipe) => (
                  <div key={recipe.id} className="latest-card">
                    <div className="latest-image">
                      <img
                        src={recipesService.getImageUrl(recipe.image)}
                        alt={recipe.name}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/300/200';
                        }}
                      />
                    </div>
                    <div className="latest-content">
                      <div className="latest-category">Latest Recipe</div>
                      <h3>{recipe.name}</h3>
                      <div className="latest-meta">
                        <span><Clock size={14} /> {formatTime(recipe.cooking_time)}</span>
                        <span><User size={14} /> By Chef</span>
                      </div>
                      <Link to={`/recipe/${recipe.slug}`} className="read-more">
                        READ MORE
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="latest-sidebar">
              <div className="sidebar-section">
                <h4>Latest Recipe</h4>
                <div className="sidebar-recipes">
                  {latestRecipes.slice(4, 8).map((recipe) => (
                    <Link key={recipe.id} to={`/recipe/${recipe.slug}`} className="sidebar-recipe">
                      <div className="sidebar-image">
                        <img
                          src={recipesService.getImageUrl(recipe.image)}
                          alt={recipe.name}
                          onError={(e) => {
                            e.target.src = '/api/placeholder/80/80';
                          }}
                        />
                      </div>
                      <div className="sidebar-content">
                        <h5>{recipe.name}</h5>
                        <div className="sidebar-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={10} className="star" />
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h4>Popular Tags</h4>
                <div className="popular-tags">
                  <span className="tag">Rice Curry</span>
                  <span className="tag">Desserts</span>
                  <span className="tag">Traditional</span>
                  <span className="tag">Quick & Easy</span>
                  <span className="tag">Vegetarian</span>
                  <span className="tag">Spicy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Top & Popular Recipes */}
      <section className="bottom-sections">
        <div className="container">
          <div className="bottom-grid">
            {/* Weekly Top Recipes */}
            <div className="bottom-section">
              <h3>Weekly Top Recipes</h3>
              <div className="weekly-recipes">
                {latestRecipes.slice(0, 3).map((recipe, index) => (
                  <div key={recipe.id} className="weekly-item">
                    <div className="weekly-image">
                      <img
                        src={recipesService.getImageUrl(recipe.image)}
                        alt={recipe.name}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/100/80';
                        }}
                      />
                    </div>
                    <div className="weekly-content">
                      <div className="weekly-category">Everyday Comforts</div>
                      <h4>{recipe.name}</h4>
                      <div className="weekly-meta">
                        <span>{formatTime(recipe.cooking_time)}</span>
                        <span>By Chef</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Popular Recipes */}
            <div className="bottom-section">
              <h3>Most Popular Recipes</h3>
              <div className="popular-recipes">
                {latestRecipes.slice(3, 6).map((recipe) => (
                  <div key={recipe.id} className="popular-item">
                    <div className="popular-image">
                      <img
                        src={recipesService.getImageUrl(recipe.image)}
                        alt={recipe.name}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/100/80';
                        }}
                      />
                    </div>
                    <div className="popular-content">
                      <div className="popular-category">Special Occasions</div>
                      <h4>{recipe.name}</h4>
                      <div className="popular-meta">
                        <span>{formatTime(recipe.cooking_time)}</span>
                        <span>By Chef</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
                     <Footer />
    </div>
  );
};

export default Home;