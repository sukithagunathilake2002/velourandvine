import React from "react";
import "../styles/AboutUs.css";
import backgroundImage from "../assets/image3.png";
import visionImage from "../assets/vision.jpg";
import missionImage from "../assets/mission.jpg";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Background Image Header */}
      <div className="about-us-header">
        <h1 className="about-us-title">About Us</h1>
      </div>
      
      {/* Content Section */}
      <div className="about-us-content">
        <h2 className="about-us-history-title">Our History</h2>
        <p className="about-us-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.
        </p>
        
        {/* Video Section  done */}
        <div className="about-us-video-container">
          <iframe
            className="about-us-video"
            src="https://www.youtube.com/embed/WW0SLuX8HsI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      {/* Vision & Mission Section */}
      <div className="vision-mission-section">
        <div className="vision-container">
          <h2 className="vision-title">Our Vision</h2>
          <img src={visionImage} alt="Our Vision" className="vision-image" />
          <p className="vision-text">
            "To be the epitome of elegance and flavor, creating unforgettable dining
            experiences with every dish."
          </p>
        </div>
        <div className="mission-container">
          <h2 className="mission-title">Our Mission</h2>
          <img src={missionImage} alt="Our Mission" className="mission-image" />
          <p className="mission-text">
            "To craft exquisite cuisine using the finest ingredients, blending sophistication
            with warmth, and offering an ambiance that delights the senses."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
