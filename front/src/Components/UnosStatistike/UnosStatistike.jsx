import React, { useState, useEffect } from "react";
import axios from "axios";
import StatistikaIgraca from "../StatistikaIgraca/StatistikaIgraca";
import StatistikaMeca from "../StatistikaMeca/StatistikaMeca";
import "./UnosStatistike.css";

const UnosStatistike = ({ id, onClose }) => {
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showEnterStatsPopup, setShowEnterStatsPopup] = useState(true);
  const [team1Stats, setTeam1Stats] = useState({
    names: ["", "", "", "", ""],
    goals: [0, 0, 0, 0, 0],
    assists: [0, 0, 0, 0, 0],
    shotsOnTarget: [0, 0, 0, 0, 0],
    shotsOffTarget: [0, 0, 0, 0, 0],
    yellowCards: [0, 0, 0, 0, 0],
    redCards: [0, 0, 0, 0, 0],
    possession: 50,
  });

  const [team2Stats, setTeam2Stats] = useState({
    names: ["", "", "", "", ""],
    goals: [0, 0, 0, 0, 0],
    assists: [0, 0, 0, 0, 0],
    shotsOnTarget: [0, 0, 0, 0, 0],
    shotsOffTarget: [0, 0, 0, 0, 0],
    yellowCards: [0, 0, 0, 0, 0],
    redCards: [0, 0, 0, 0, 0],
    possession: 50,
  });

  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/utakmice/${id}`,
          {
            headers: {
              Authorization:
                "Bearer " + window.sessionStorage.getItem("auth_token"),
            },
          }
        );
        const data = response.data.data;
        setTeam1Name(data.domaci_tim.naziv);
        setTeam2Name(data.gostujuci_tim.naziv);

        const homeTeamStats = data.domaci_tim.igraci.map((igrac) => ({
          id: igrac.id,
          name: igrac.prezime,
          number: igrac.pozicija,
          goals: igrac.statistika_igraca.golovi,
          assists: igrac.statistika_igraca.astistencije,
          yellowCards: igrac.statistika_igraca.zuti_kartoni,
          redCards: igrac.statistika_igraca.crveni_kartoni,
          shotsOnTarget: igrac.statistika_igraca.sutevi_u_gol,
          shotsOffTarget: igrac.statistika_igraca.sutevi_van_gola,
        }));

        const awayTeamStats = data.gostujuci_tim.igraci.map((igrac) => ({
          id: igrac.id,
          name: igrac.prezime,
          number: igrac.pozicija,
          goals: igrac.statistika_igraca.golovi,
          assists: igrac.statistika_igraca.astistencije,
          yellowCards: igrac.statistika_igraca.zuti_kartoni,
          redCards: igrac.statistika_igraca.crveni_kartoni,
          shotsOnTarget: igrac.statistika_igraca.sutevi_u_gol,
          shotsOffTarget: igrac.statistika_igraca.sutevi_van_gola,
        }));

        setTeam1Stats({
          id: homeTeamStats.map((igrac) => igrac.id),
          names: homeTeamStats.map((igrac) => igrac.name),
          goals: homeTeamStats.map((igrac) => igrac.golovi),
          assists: homeTeamStats.map((igrac) => igrac.asistencije),
          shotsOnTarget: homeTeamStats.map((igrac) => igrac.sutevi_u_gol),
          shotsOffTarget: homeTeamStats.map((igrac) => igrac.sutevi_van_gola),
          yellowCards: homeTeamStats.map((igrac) => igrac.zuti_kartoni),
          redCards: homeTeamStats.map((igrac) => igrac.crveni_kartoni),
          possession: data.statistika_utakmice.posed_lopte_domacin || 0,
        });

        setTeam2Stats({
          id: awayTeamStats.map((igrac) => igrac.id),
          names: awayTeamStats.map((igrac) => igrac.name),
          goals: awayTeamStats.map((igrac) => igrac.golovi),
          assists: awayTeamStats.map((igrac) => igrac.asistencije),
          shotsOnTarget: awayTeamStats.map((igrac) => igrac.sutevi_u_gol),
          shotsOffTarget: awayTeamStats.map((igrac) => igrac.sutevi_van_gola),
          yellowCards: awayTeamStats.map((igrac) => igrac.zuti_kartoni),
          redCards: awayTeamStats.map((igrac) => igrac.crveni_kartoni),
          possession: data.statistika_utakmice.posed_lopte_domacin || 0,
        });
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };
    fetchPlayerStats();
  }, [id]);

  const handlePlayerStats = () => {
    setShowMatchDetails(false);
    setShowPlayerStats(true);
    setShowEnterStatsPopup(false);
  };

  const handleMatchStats = () => {
    setShowMatchDetails(true);
    setShowPlayerStats(false);
    setShowEnterStatsPopup(false);
  };

  const handleEnterStats = () => {
    setShowMatchDetails(false);
    setShowPlayerStats(false);
    setShowEnterStatsPopup(true);
  };

  if (showPlayerStats) {
    return <StatistikaIgraca id={id} onClose={onClose} />;
  }

  if (showMatchDetails) {
    return <StatistikaMeca id={id} onClose={onClose} />;
  }

  const handleChange = (team, index, stat, value) => {
    if (value < 0) return;

    const setStats = team === 1 ? setTeam1Stats : setTeam2Stats;
    const otherSetStats = team === 1 ? setTeam2Stats : setTeam1Stats;

    setStats((prev) => {
      const newStats = {
        ...prev,
        [stat]:
          stat === "possession"
            ? value
            : prev[stat].map((val, i) => (i === index ? value : val)),
      };

      if (stat === "possession") {
        otherSetStats((prevOther) => ({
          ...prevOther,
          possession: 100 - value,
        }));
      }

      return newStats;
    });
  };

  const handleSave = async () => {
    try {
      const updatedStats = {
        domaci_tim: {
          players: team1Stats,
          possession: team1Stats.possession,
        },
        away_team: {
          players: team2Stats,
          possession: team2Stats.possession,
        },
      };

      const response = await axios.put(
        `http://localhost:8000/api/utakmice/${id}`,
        updatedStats,
        {
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        }
      );
      console.log(response.data);

      alert("Statistika uspešno sačuvana");
      onClose();
    } catch (error) {
      console.error("Error saving player stats:", error);
      alert("Došlo je do greške prilikom čuvanja statistike");
    }
  };

  const renderStatsTable = (teamStats, teamNumber) => (
    <div className="stats-table">
      <div className="stats-row">
        <span>Igrač</span>
        {teamStats.names.map((name, i) => (
          <span key={i}>{name}</span>
        ))}
      </div>
      {[
        "goals",
        "assists",
        "shotsOnTarget",
        "shotsOffTarget",
        "yellowCards",
        "redCards",
      ].map((stat, idx) => (
        <div key={idx} className="stats-row">
          <span>{getStatLabel(stat)}</span>
          {teamStats[stat].map((value, i) => (
            <input
              key={i}
              type="number"
              value={value}
              min="0"
              onChange={(e) =>
                handleChange(teamNumber, i, stat, Number(e.target.value))
              }
              onKeyDown={(e) => e.preventDefault()}
            />
          ))}
        </div>
      ))}
      <div className="stats-row">
        <span>Posed (%)</span>
        <input
          type="number"
          value={teamStats.possession}
          min="0"
          max="100"
          onChange={(e) =>
            handleChange(teamNumber, null, "possession", Number(e.target.value))
          }
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );

  const getStatLabel = (stat) => {
    switch (stat) {
      case "goals":
        return "Golovi";
      case "assists":
        return "Asistencije";
      case "shotsOnTarget":
        return "Šutevi u okvir";
      case "shotsOffTarget":
        return "Šutevi van okvira";
      case "yellowCards":
        return "Žuti kartoni";
      case "redCards":
        return "Crveni kartoni";
      default:
        return "";
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Unos statistike utakmice</h2>

        <div className="stats-container">
          <div className="team-stats">
            <h3>{team1Name}</h3>
            {renderStatsTable(team1Stats, 1)}
          </div>
          <div className="team-stats">
            <h3>{team2Name}</h3>
            {renderStatsTable(team2Stats, 2)}
          </div>
        </div>
        <div className="popup-buttons">
          <button className="stat-btn" onClick={handleMatchStats}>
            Statistika Meča
          </button>
          <button className="stat-btn" onClick={handlePlayerStats}>
            Statistika Igrača
          </button>
          <button className="stat-btn" onClick={handleEnterStats}>
            Unesi Statistiku
          </button>
          <button className="update-btn" onClick={handleSave}>
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnosStatistike;
