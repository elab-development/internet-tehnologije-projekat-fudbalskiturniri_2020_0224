import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import "./NapraviTurnir.css";
import Navigacija from "../Navigation/Navigacija";

const NapraviTurnir = () => {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [teams, setTeams] = useState("");
  const [logo, setLogo] = useState("");
  const [showLogo, setShowLogo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { role } = location.state || {};

  const handleLogoSelection = () => {
    setShowLogo(true);
  };

  const handleLogoSelect = (selectedLogo) => {
    setLogo(selectedLogo);
    setShowLogo(false);
  };

  const handleCloseLogo = () => {
    setShowLogo(false);
  };

  const handleBackClick = () => {
    navigate("/turniri", { state: { role: "admin" } });
  };

  const handleNextClick = (event) => {
    event.preventDefault();
    if (!name || !place || !teams || !logo) {
      alert(
        "Molim Vas popunite polja za naziv turnira, mesto odigravanja, broj ekipa i izaberite logo."
      );
      return;
    }
    navigate("/dodaj-tim", {
      state: {
        name,
        place,
        numTeams: parseInt(teams, 10),
        logo,
        role,
      },
    });
  };

  return (
    <div className="create-tournament-container">
      <Navigacija role={role} />
      <h2>Napravi novi turnir</h2>
      <form>
        <div className="input-container">
          <label>Naziv turnira:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Mesto igranja:</label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label>Broj timova:</label>
          <select
            value={teams}
            onChange={(e) => setTeams(e.target.value)}
            required
          >
            <option value="" disabled>
              Izaberi Broj Timova
            </option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="16">16</option>
          </select>
        </div>
        <div className="input-container">
          <label>Izaberi Logo Turnira:</label>
          <button
            type="button"
            onClick={handleLogoSelection}
            className="choose-logo-btn"
          >
            Izaberi Logo
          </button>
          {logo ? (
            <img src={logo} alt="Selected Logo" className="logo-preview" />
          ) : (
            <div className="logo-placeholder"></div>
          )}
        </div>
        <div className="button-container">
          <button
            type="button"
            onClick={handleBackClick}
            className="action-btn create-back-btn"
          >
            Nazad
          </button>
          <button
            type="submit"
            onClick={handleNextClick}
            className="action-btn create-next-btn"
          >
            Dalje
          </button>
        </div>
      </form>
      {showLogo && (
        <Logo onSelect={handleLogoSelect} onClose={handleCloseLogo} />
      )}
    </div>
  );
};

export default NapraviTurnir;
