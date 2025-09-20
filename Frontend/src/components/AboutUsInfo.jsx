import React from "react";
import AboutUsSection from "./AboutUsSection";
import AboutUsContact from "./AboutUsContact";

function AboutUsInfo() {
  return (
    <div className="page">
      <h1 className="hero-title">About Us</h1>

      <AboutUsSection imageLink={cinema.jpg} reverse={false} section="first" />

      <AboutUsSection
        imageLink={cinemappl.jpeg}
        reverse={true}
        section="second"
      />
      <AboutUsContact />
    </div>
  );
}

export default AboutUsInfo;
