import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Turniri.css";
import Navigacija from "../Navigation/Navigacija";

const Turniri = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {}; // Get role from state

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:8000/api/turniri",
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        };
        const response = await axios.request(config);
        setTournaments(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the tournaments!", error);
      }
    };

    fetchTournaments();
  }, []);

  const handleFavoriteClick = async (id, isFavorite, event) => {
    try {
      event.stopPropagation();
      const config = {
        method: isFavorite ? "delete" : "post",
        url: `http://localhost:8000/api/turniri/omiljeni/${id}`,
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      };
      await axios.request(config);

      // Update the state to reflect the change
      setTournaments((prevTournaments) =>
        prevTournaments.map((turnir) =>
          turnir.id === id ? { ...turnir, isFavorite: !isFavorite } : turnir
        )
      );
    } catch (error) {
      console.error("There was an error updating the favorite status!", error);
    }
  };

  const handleTournamentClick = (turnir) => {
    console.log(turnir);
    navigate(`/utakmice/${turnir.id}`, { state: { role } });
  };

  return (
    <div className="tournaments-container">
      <Navigacija role={role} />
      <h2>Svi Turniri</h2>
      <div className="tournaments-list">
        {tournaments.map((turnir) => (
          <div
            key={turnir.id}
            className="tournament-card"
            onClick={() => handleTournamentClick(turnir)}
          >
            <div className="card-content">
              <div className="tournament-info">
                <h3 className="naslov">{turnir.naziv}</h3>
                <p>Lokacija: {turnir.mesto_odrzavanja}</p>
                <p>Broj Timova: {turnir.broj_ekipa}</p>
                {role === "user" && (
                  <span
                    className={`favorite-star ${
                      turnir.isFavorite ? "favorite" : ""
                    }`}
                    onClick={(event) =>
                      handleFavoriteClick(turnir.id, turnir.isFavorite, event)
                    }
                  >
                    &#9733;
                  </span>
                )}
              </div>
              <img
                src={turnir.logo}
                alt={turnir.naziv}
                className="tournament-logo"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Turniri;
