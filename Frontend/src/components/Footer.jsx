import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* CritiCrew info */}
        <div className="footer-section">
          <h3>CritiCrew</h3>
          <p>
            Your ultimate destination for movie ratings, reviews, and
            information.
          </p>
        </div>

        {/* Quick links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="/filter">Filter</RouterLink>
            </li>
            <li>
              <RouterLink to="/random">Random Movie</RouterLink>
            </li>
            <li>
              <RouterLink to="/about">About Us</RouterLink>
            </li>
          </ul>
        </div>

        {/* Social links */}
        <div className="footer-section follow-us">
          <h4>Follow Us</h4>
          <SocialLinks />
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <p>© 2025 CritiCrew. All rights reserved.</p>
      </div>
    </footer>
  );
}
