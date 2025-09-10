import React from "react";
import cinemaImage from "../../public/images/cinema.jpg";
import cinemaPeopleImage from "../../public/images/cinemappl.jpeg";
import AboutUsSection from "./AboutUsSection";
import AboutUsContact from "./AboutUsContact";

function AboutUsInfo() {
  return (
    <div className="page">
      <h1 className="hero-title">About Us</h1>

      <AboutUsSection 
        imageLink={cinemaImage} 
        reverse={false} 
        section="first" 
      />

      <AboutUsSection
        imageLink={cinemaPeopleImage}
        reverse={true}
        section="second"
      />
      <AboutUsContact />
    </div>
  );
}

export default AboutUsInfo;
