import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DodajTim.css";
import TimModal from "../TimModal/TimModal";
import axios from "axios";
import Navigacija from "../Navigation/Navigacija";

const DodajTim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const [teams, setTeams] = useState(() => {
    const initialTeams = Array(location.state?.numTeams || 4).fill({
      id: null,
      name: "",
      players: [],
    });
    if (location.state?.existingTeams) {
      location.state.existingTeams.forEach((team, index) => {
        initialTeams[index] = team;
      });
    }
    return initialTeams;
  });

  const [tournamentName, setTournamentName] = useState(
    location.state?.name || "Unknown Tournament"
  );
  const [placeOfPlaying, setPlaceOfPlaying] = useState(
    location.state?.place || "Unknown Place"
  );
  const [logo, setLogo] = useState(location.state?.logo || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);

  useEffect(() => {
    if (
      location.state?.newTeam !== undefined &&
      location.state?.rowIndex !== undefined
    ) {
      const updatedTeams = [...teams];
      updatedTeams[location.state.rowIndex] = location.state.newTeam;
      setTeams(updatedTeams);
    }
  }, [location.state?.newTeam, location.state?.rowIndex]);

  const handleBackClick = () => {
    navigate("/napravi-turnir", {
      state: {
        name: tournamentName,
        place: placeOfPlaying,
        numTeams: teams.length,
        existingTeams: teams,
        logo,
      },
    });
  };

  const handleCreateTournament = async () => {
    if (teams.some((team) => !team.name || team.players.length < 5)) {
      alert(
        "Ubacite sve timove i dodajte 5 igrača pre nego što kreirate turnir."
      );
      return;
    }

    // Check for duplicate teams
    const teamNames = new Set();
    for (const team of teams) {
      if (teamNames.has(team.name)) {
        alert(
          "Postoje timovi sa istim imenom. Molimo vas da ih uklonite pre nego što kreirate turnir."
        );
        return;
      }
      teamNames.add(team.name);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/turniri",
        {
          name: tournamentName,
          place: placeOfPlaying,
          logo: logo,
          numTeams: teams.length,
          teams: teams,
        },
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );

      if (response.data.success === true) {
        alert("Turnir uspešno kreiran!");
        navigate("/turniri", {
          state: { role: window.sessionStorage.getItem("role") },
        });
      } else {
        alert("Došlo je do greške pri kreiranju turnira.");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Došlo je do greške pri kreiranju turnira.");
    }
  };

  const handleCreateNewTeam = (index) => {
    navigate("/napravi-nov-tim", {
      state: {
        rowIndex: index,
        name: tournamentName,
        place: placeOfPlaying,
        existingTeams: teams,
        logo,
        role,
      },
    });
  };

  const handleChooseTeam = (index) => {
    setSelectedTeamIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectTeam = (team) => {
    const updatedTeams = [...teams];
    updatedTeams[selectedTeamIndex] = team;
    setTeams(updatedTeams);
    setIsModalOpen(false);
    console.log(teams);
  };

  return (
    <div className="add-teams-container">
      <Navigacija role={role} />
      <h2>DODAJ TIMOVE U TURNIR</h2>
      <div className="tournament-info">
        <p>
          <strong>NAZIV TURNIRA:</strong> {tournamentName}
        </p>
        {logo && (
          <div className="logo-container">
            <img src={logo} alt="Tournament Logo" className="logo-image" />
          </div>
        )}
        <p>
          <strong>MESTO IGRANJA:</strong> {placeOfPlaying}
        </p>
      </div>
      <form className="teams-form">
        {teams.map((team, index) => (
          <div key={index} className="team-row">
            <input
              type="text"
              placeholder="Ime Tima"
              value={team.name}
              className="team-input"
              disabled
            />
            <button
              type="button"
              onClick={() => handleChooseTeam(index)}
              className="choose-team-btn"
            >
              Izaberi Postojeće Timove
            </button>
            <button
              type="button"
              onClick={() => handleCreateNewTeam(index)}
              className="create-team-btn"
            >
              Napravi Novi Tim
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
            onClick={handleCreateTournament}
            className="action-btn create-tournament-btn"
          >
            Kreiraj Turnir
          </button>
        </div>
      </form>
      {isModalOpen && (
        <TimModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectTeam={handleSelectTeam}
        />
      )}
    </div>
  );
};

export default DodajTim;
