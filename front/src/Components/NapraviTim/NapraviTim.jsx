import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NapraviTim.css";
import IgracModal from "./IgracModal";
import Navigacija from "../Navigation/Navigacija";
 
const NapraviTim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState(
    Array(5).fill({ id: null, name: "", surname: "", pozicija: "" })
  );
  const [isIgracModalOpen, setIsIgracModalOpen] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [editMode, setEditMode] = useState(Array(5).fill(false));
 
  const handlePlayerChange = (index, event) => {
    const { name, value } = event.target;
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, [name]: value } : player
      )
    );
  };
 
  const handleAddTeam = () => {
    if (!teamName) {
      alert("Ime tima je obavezno");
      return;
    }
 
 
    if (players.every((player) => player.name && player.surname)) {
      navigate("/add-teams", {
        state: {
          newTeam: {
            id: null,
            name: teamName,
            players: players,
          },
          rowIndex: location.state.rowIndex,
          name: location.state.name,
          place: location.state.place,
          existingTeams: location.state.existingTeams,
          logo: location.state.logo,
        },
      });
    } else {
      alert("Svaki tim mora imati 5 igrača sa imenom i prezimenom");
    }
  };
 
  const handleBackClick = () => {
    navigate("/dodaj-tim", {
      state: {
        name: location.state.name,
        place: location.state.place,
        existingTeams: location.state.existingTeams,
        logo: location.state.logo,
      },
    });
  };
 
  const handleNewPlayerClick = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = true;
 
    const updatePlayers = [...players];
    updatePlayers[index] = { id: null, name: "", surname: "", pozicija: "" };
 
    setEditMode(updatedEditMode);
    setPlayers(updatePlayers);
  };
 
  const handleChoosePlayer = (index) => {
    setSelectedPlayerIndex(index);
    setIsIgracModalOpen(true);
  };
 
  const handleExistingPlayerClick = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = false;
    setEditMode(updatedEditMode);
    handleChoosePlayer(index);
  };
 
  const handleSelectPlayer = (player) => {
    const updatedPlayers = [...players];
    updatedPlayers[selectedPlayerIndex] = player;
    setPlayers(updatedPlayers);
 
    const updatedEditMode = [...editMode];
    updatedEditMode[selectedPlayerIndex] = false;
    setEditMode(updatedEditMode);
 
    setIsIgracModalOpen(false);
  };
 
  return (
<div className="create-new-team-container">
<Navigacija role={role} />
<h2>Napravi Novi Tim</h2>
<form>
<div className="input-container">
<label>Ime Tima:</label>
<input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Unesi Ime Tima"
            required
          />
</div>
        {players.map((player, index) => (
<div key={index} className="player-row">
<input
              type="text"
              name="name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder="Ime Igrača"
              required
              className="player-input"
              disabled={!editMode[index]}
            />
<input
              type="text"
              name="surname"
              value={player.surname}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder="Prezime Igrača"
              required
              className="player-input"
              disabled={!editMode[index]}
            />
<input
              type="text"
              name="pozicija"
              value={player.pozicija}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder="Pozicija Igrača"
              required
              className="player-input"
            />
<button
              type="button"
              className="choose-player-btn"
              onClick={() => handleExistingPlayerClick(index)}
>
              Izaberi Postojećeg Igrača
</button>
<button
              type="button"
              className="new-player-btn"
              onClick={() => handleNewPlayerClick(index)}
>
              Nov Igrač
</button>
</div>
        ))}
<div className="button-container">
<button
            type="button"
            onClick={handleBackClick}
            className="action-btn create-back-btn"
>
            Nazad
</button>
<button
            type="button"
            onClick={handleAddTeam}
            className="action-btn add-team-btn"
>
            Dodaj Tim
</button>
</div>
</form>
<IgracModal
        isOpen={isIgracModalOpen}
        onClose={() => setIsIgracModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
      />
</div>
  );
};
 
export default NapraviTim;