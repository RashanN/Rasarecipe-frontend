import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, ChefHat } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'RECIPES', path: '/recipes' },
    { name: 'BRANDS', path: '/brands' },
    { name: 'ABOUT US', path: '/aboutus' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-container">
            <img 
              src="/uploads/web/logo-90.png" 
              alt="Rasa Recipe" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{ display: 'none' }}>
              <ChefHat size={32} className="logo-icon" />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                <User size={18} />
               {/*  <span>Welcome, {currentUser.name}</span>*/}
              </div>
               <Link to="/recipes/add" className="add-recipe-btn">
                 + Add Recipe
                </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                LOGIN
              </Link>
              <Link to="/register" className="register-btn">
                JOIN RECIPE
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Navigation Items */}
          <div className="mobile-nav-items">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="mobile-auth">
            {currentUser ? (
              <div className="mobile-user-menu">
                <div className="mobile-user-info">
                  <User size={18} />
              {/*  <span>Welcome, {currentUser.name}</span>*/}
                </div>
                 <Link 
                    to="/recipes/add" 
                    className="mobile-add-recipe-btn"
                    onClick={closeMobileMenu}
                  >
                    + Add Recipe
                  </Link>

                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="mobile-login-btn" onClick={closeMobileMenu}>
                  LOGIN
                </Link>
                <Link to="/register" className="mobile-register-btn" onClick={closeMobileMenu}>
                  JOIN RECIPE
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;