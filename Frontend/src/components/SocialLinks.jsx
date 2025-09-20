import React from "react";
import { Instagram, Twitter, YouTube } from "@mui/icons-material";
import "../styles/footer.css";

const socialMedia = [
  { name: "Instagram", url: "https://www.instagram.com", icon: <Instagram /> },
  { name: "X", url: "https://www.x.com", icon: <Twitter /> }, // Using Twitter icon for X
  { name: "YouTube", url: "https://www.youtube.com", icon: <YouTube /> },
];

export default function SocialLinks() {
  return (
    <div className="social-links">
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon-link"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
