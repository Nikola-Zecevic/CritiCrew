import React from "react";
import cinemaImage from "../../public/images/cinema.jpg";
import cinemaPeopleImage from "../../public/images/cinemappl.jpeg";
import "../styles/About.css"; 

function About() {
  return (
    <div className="page">
      <h1 className="hero-title">About Us</h1>
      
      <div className="section">
        <div className="text-content">
          <p className="hero-text">
            We're a small team of film enthusiasts who believe a great movie is more than 
            entertainment—it's a shared experience that brings people together. It all started 
            with our own movie nights, where we saw how powerful stories could spark laughter, 
            debate, and create lasting memories.
          </p>
          <p className="hero-text">
            Our mission is simple: to cut through the endless options and help you discover 
            films you'll genuinely love. We're not critics—we're your knowledgeable movie-going 
            friends who want to share the magic of cinema with you.
          </p>
        </div>
        <div className="image-container">
          <img src={cinemaImage} alt="Cinema" className="image" />
        </div>
      </div>
      
      <div className="section reverse">
        <div className="image-container">
          <img src={cinemaPeopleImage} alt="Cinema with people in it" className="image" />
        </div>
        <div className="text-content">
          <p className="hero-text">
            We're real people who pour our passion into this project. Our content comes from 
            genuine enjoyment and thoughtful analysis—we celebrate great filmmaking and offer 
            honest perspectives.
          </p>
          <p className="hero-text">
            Movies are a conversation that doesn't end when the credits roll. Join our community, 
            share your thoughts, and let's discover great films together.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;