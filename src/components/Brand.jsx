import React from "react";
import Footer from "../components/Footer";

import './Brand.css';
const Brands = () => {
  // Placeholder array for brand images (replace with dynamic data if needed)
  const brandImages = [
    "/uploads/brands/Lanka-Soy.jpg",
    "/uploads/brands/Munchee.jpg",
    "/uploads/brands/Nutriline.jpg",
    "/uploads/brands/Ritsbury.jpg",
    "/uploads/brands/Rovello.jpg",
    "/uploads/brands/Samaposha.jpg",
     "/uploads/brands/Sera.jpg",
      "/uploads/brands/Spar.jpg",
       "/uploads/brands/Tetos.jpg",
        "/uploads/brands/Tetos.jpg",
  ];

  return (
    <div className="page-wrapper">
      {/* Header Section */}
      <section className="header-section">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1>Explore Our Brands</h1>
          <p>Discover the finest brands in the culinary world</p>
        </div>
      </section>

      {/* Image Grid */}
      <div className="main-content">
        <div className="image-grid">
          {brandImages.map((image, index) => (
            <div key={index} className="image-card">
              <img src={image} alt={`Brand ${index + 1}`} className="brand-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Brands;