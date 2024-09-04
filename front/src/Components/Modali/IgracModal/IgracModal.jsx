import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IgracModal.css";

const IgracModal = ({ isOpen, onClose, onSelectPlayer }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/igraci", {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        });

        if (Array.isArray(response.data?.data)) {
          setPlayers(response.data.data);
        } else {
          setPlayers([]);
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      }
    };

    if (isOpen) {
      fetchPlayers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izaberi Igrača</h2>
        <ul className="player-list">
          {players.map((player, index) => (
            <li key={index} onClick={() => onSelectPlayer(player)}>
              {player.name} (Broj godina: {player.number})
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default IgracModal;
