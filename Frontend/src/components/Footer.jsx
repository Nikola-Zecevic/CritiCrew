import React from "react";
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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/custom">Custom Page</a>
              </li>
              <li>
                <a href="/about">About Us</a>
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
