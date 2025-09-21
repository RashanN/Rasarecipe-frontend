import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/uploads/web/logo-90.png" alt="Rasa Recipe" className="footer-logo-img" />
              <h3>Rasa Recipe</h3>
            </div>
            <p className="footer-description">
              Discover authentic Sri Lankan recipes and culinary traditions. 
              Share your favorite recipes with our community.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/recipes">Recipes</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Popular Categories</h4>
            <ul className="footer-links">
              <li><Link to="/category/rice-curry">Rice & Curry</Link></li>
              <li><Link to="/category/desserts">Desserts</Link></li>
              <li><Link to="/category/snacks">Snacks</Link></li>
              <li><Link to="/category/beverages">Beverages</Link></li>
              <li><Link to="/category/traditional">Traditional</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <Phone size={16} />
                <span>+94 123 456 789</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+94 987 654 321</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>recipe@rasarecipe.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Rasa Recipe. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;