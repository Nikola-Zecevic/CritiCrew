import React from "react";
import "../styles/Footer.css";

const socialMedia = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: "/images/facebook.png",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: "/images/instagram.webp",
  },
  { name: "X", url: "https://www.x.com", icon: "/images/x.webp" },
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
        >
          <img src={social.icon} alt={social.name} className="social-icon" />
        </a>
      ))}
    </div>
  );
}
