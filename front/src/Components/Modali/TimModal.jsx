import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TimModal.css";

const TimModal = ({ isOpen, onClose, onSelectTeam }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/timovi", {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        });

        if (Array.isArray(response.data?.data)) {
          setTeams(response.data.data);
        } else {
          setTeams([]);
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeams([]);
      }
    };

    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izaberi Tim</h2>
        <ul className="team-list">
          {teams.map((team, index) => (
            <li key={index} onClick={() => onSelectTeam(team)}>
              {team.name}
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

export default TimModal;
