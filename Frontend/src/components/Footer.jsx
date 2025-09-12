import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import SocialLinks from "./SocialLinks";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CritiCrew</h3>
            <p>
              Your ultimate destination for movie ratings, reviews, and
              information.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/filter">Filter</Link>
              </li>
              <li>
                <Link to="/random">Random Movie</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <SocialLinks />
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CritiCrew. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
