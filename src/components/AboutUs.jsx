import React from "react";
import Footer from "../components/Footer";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="page-wrapper">
      {/* Header Section */}
      <section className="header-section">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1>About Us</h1>
          <p>Learn more about our journey</p>
        </div>
      </section>

      {/* First Section (Image Left, Text Right) */}
      <section className="first-section">
        <img src="/uploads/web/image-502.png" alt="About Us" className="section-image" />
        <div className="section-text">
          <h2>Our Story</h2>
          <p>
            Elevate your culinary journey with Rasa Recipe – where passion meets the plate, and every recipe is a story waiting to be savored.
At Rasa Recipe, we are your culinary companions on a quest for delightful dining experiences. Founded on a commitment to share the art and science of cooking, we provide a diverse collection of meticulously crafted recipes, cooking tips, and kitchen inspirations. Whether you're a seasoned chef or a novice in the kitchen, join us in exploring the world of flavors and transforming everyday meals into extraordinary moment.
          </p>
        </div>
      </section>

      {/* Second Section (Centered Text) */}
      <section className="second-section">
        <div className="centered-content">
          <h2>Our Mission</h2>
          <p>
            We aim to inspire creativity in every kitchen, providing a platform for sharing and discovering culinary delights. Join us on this delicious adventure!
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;