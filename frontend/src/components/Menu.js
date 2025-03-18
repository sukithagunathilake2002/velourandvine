import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menuco.css";
import menuHeaderImg from "../assets/image6.png";
import AppetizersImg from "../assets/AppetizerMe.png";
import MainCoursesImg from "../assets/MainCoursesMe.png";
import SaladsImg from "../assets/SaladsMe.png";
import DessertsImg from "../assets/DessertsMe.png";
import WineSelectionImg from "../assets/WineSelectionMe.png";
import SignatureCocktailsImg from "../assets/SignaturecocktailsMe.png";

const Menu = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Appetizers", image: AppetizersImg, path: "/appetizers" },
    { name: "Main Courses", image: MainCoursesImg, path: "/main-courses" },
    { name: "Salads", image: SaladsImg, path: "/salads" },
    { name: "Desserts", image: DessertsImg, path: "/desserts" },
    { name: "Wine Selection", image: WineSelectionImg, path: "/wine-selection" },
    { name: "Signature Cocktails", image: SignatureCocktailsImg, path: "/signature-cocktails" },
  ];

  return (
    <div className="menu-wrapper">
      <div className="menu-header" style={{ backgroundImage: `url(${menuHeaderImg})` }}>
        <div className="menu-overlay">
          <div className="menu-title-box">
            <h1 className="menu-title">MENU</h1>
          </div>
        </div>
      </div>
      <div className="menu-container">
        <div className="menu-content">
          <h2 className="menu-subtitle">Make your Order</h2>
          <h3 className="menu-heading">Dishes On Our Menu</h3>
          <p className="menu-description">
            That’s a beautiful name for a restaurant! With <b>Velour & Vine</b>, it sounds like a classy, elegant place with a focus on quality ingredients and fine dining.
            <br />Here’s a refined and aesthetic menu concept that complements the name:
          </p>
        </div>
        <div className="menu-categories">
          {categories.map((category, index) => (
            <div key={index} className="menu-category" onClick={() => navigate(category.path)}>
              <img src={category.image} alt={category.name} className="menu-category-image" />
              <h2 className="menu-category-name">{category.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
