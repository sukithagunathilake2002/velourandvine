import React from "react";
import Slider from "react-slick";
import "../styles/Home.css"; 
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
 

// Import the Footer component

const Home = () => {
  const carouselImages = [image1, image2, image3, image4];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  return (
    <div className="home-container">

      
      {/* First Section: Carousel */}
      <div className="carousel-container">
        <Slider {...settings}>
          {carouselImages.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Slide ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </Slider>
      </div>

      {/* First Section Below Carousel: Image 4 Right, Text Left */}
      <div className="text-section text-left">
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui 
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
        </p>
        <img src={image4} alt="Food Dish" className="text-image" />
      </div>

      {/* Second Section Below Carousel: Image 3 Left, Text Right */}
      <div className="text-section text-right">
        <img src={image3} alt="Monochrome Interior" className="text-image" />
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui 
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
        </p>
      </div>

      {/* Dual Image Section: Two images side by side with overlay text */}
      <div className="dual-image-section">
        <img src={image4} alt="Dining Experience" className="left-image" />
        <div className="overlay-container">
          <img src={image5} alt="Chef Plating Dish" className="right-image" />
          <div className="overlay-text-box">
            <h2>25 Dishes, endless elegance. Velour & Vine.</h2>
          </div>
        </div>
      </div>

      {/* Fourth Section: Large Background Image with Text Overlay */}
      <div className="highlight-section">
        <img src={image5} alt="Fine Dining" className="highlight-image" />
        <h2 className="overlay-text">25 dishes, endless elegance. Velour & Vine</h2>
      </div>

      {/* Fifth Section: Closing Message */}
      <div className="closing-message">
        <p>
          "Indulge in elegance with our carefully curated menu of 25 exquisite dishes. 
          From delightful appetizers to decadent desserts, each plate promises a new 
          journey of flavors.<br /><br />
          Come, explore, and treat yourself to a dining experience like no other 
          at Velour & Vine."
        </p>
      </div>

      
    </div>
  );
};

export default Home;
