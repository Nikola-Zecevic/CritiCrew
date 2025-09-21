import React from "react";
import AboutUsSection from "./AboutUsSection";
import AboutUsContact from "./AboutUsContact";

function AboutUsInfo() {
  return (
    <div className="page">
      <h1 className="hero-title">About Us</h1>
      <AboutUsSection
        imageLink="/images/cinema.jpg"
        reverse={true}
        section="first"
      />
      <AboutUsSection
        imageLink="/images/cinemappl.jpeg"
        reverse={true}
        section="second"
      />{" "}
      <AboutUsContact />
    </div>
  );
}

export default AboutUsInfo;
