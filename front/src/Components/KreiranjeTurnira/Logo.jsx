import React from "react";
import "./Logo.css";

const logos = Array.from({ length: 20 }, (_, i) => `/images/logo${i + 1}.png`);

const Logo = ({ onSelect, onClose }) => {
  return (
    <div className="logo-modal">
      <div className="logo-content">
        <button onClick={onClose} className="close-btn">
          X
        </button>
        <div className="logo-grid">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              className="logo-img"
              onClick={() => onSelect(logo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logo;
