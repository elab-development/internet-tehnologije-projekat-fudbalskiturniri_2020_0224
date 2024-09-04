import React from "react";
import "./PozicijaModal.css";

const PozicijaModal = ({ isOpen, onClose, onSelectPosition }) => {
  if (!isOpen) return null;

  const positions = ["Branič", "Vezni", "Napadač"];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izaberi Poziciju</h2>
        <ul className="position-list">
          {positions.map((position, index) => (
            <li key={index} onClick={() => onSelectPosition(position)}>
              {position}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-btn">
          Zatvori
        </button>
      </div>
    </div>
  );
};

export default PozicijaModal;
