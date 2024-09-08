import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StatistikaIgraca.css";
import { useLocation } from "react-router-dom";
import UnosStatistike from "../UnosStatistike/UnosStatistike";
import StatistikaMeca from "../StatistikaMeca/StatistikaMeca";
import Pusher from "pusher-js";

const StatistikaIgraca = ({ id, onClose, matchStatus }) => {
  const [playerStats, setPlayerStats] = useState({
    homeTeam: [],
    awayTeam: [],
    homeName: "",
    awayName: "",
  });

  const location = useLocation();
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(true);
  const [showEnterStatsPopup, setShowEnterStatsPopup] = useState(false);
  const { role } = location.state || {};

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
        populateStats(data);
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };
    fetchPlayerStats();

    const pusher = new Pusher("1ef4a6a15882c25d1174", {
      cluster: "eu",
      encrypted: true,
    });

    const channel = pusher.subscribe("utakmica." + id);
    channel.bind("promena-statistika", function (data) {
      fetchPlayerStats();
    });

    return () => {
      pusher.unsubscribe("utakmica." + id);
    };
  }, []);

  const populateStats = (data) => {
    console.log(data);
    const homeTeamStats = data.domaci_tim.igraci.map((igrac) => ({
      ime: igrac.ime,
      prezime: igrac.prezime,
      pozicija: igrac.pozicija,
      golovi: igrac.statistika_igraca.golovi,
      asistencije: igrac.statistika_igraca.asistencije,
      faulovi: igrac.statistika_igraca.faulovi,
      zuti_kartoni: igrac.statistika_igraca.zuti_kartoni,
      crveni_kartoni: igrac.statistika_igraca.crveni_kartoni,
      sutevi_u_gol: igrac.statistika_igraca.sutevi_u_gol,
      sutevi_van_gola: igrac.statistika_igraca.sutevi_van_gola,
    }));

    const awayTeamStats = data.gostujuci_tim.igraci.map((igrac) => ({
      ime: igrac.ime,
      prezime: igrac.prezime,
      pozicija: igrac.pozicija,
      golovi: igrac.statistika_igraca.golovi,
      asistencije: igrac.statistika_igraca.asistencije,
      faulovi: igrac.statistika_igraca.faulovi,
      zuti_kartoni: igrac.statistika_igraca.zuti_kartoni,
      crveni_kartoni: igrac.statistika_igraca.crveni_kartoni,
      sutevi_u_gol: igrac.statistika_igraca.sutevi_u_gol,
      sutevi_van_gola: igrac.statistika_igraca.sutevi_van_gola,
    }));

    setPlayerStats({
      homeTeam: homeTeamStats,
      awayTeam: awayTeamStats,
      homeName: data.domaci_tim.naziv,
      awayName: data.gostujuci_tim.naziv,
    });
  };

  // Handle clicking "Statistika Meča"
  const handleMatchStats = () => {
    setShowMatchDetails(true);
    setShowPlayerStats(false);
  };

  // Handle clicking "Statistika Igrača"
  const handlePlayerStats = () => {
    setShowMatchDetails(false);
    setShowPlayerStats(true);
  };

  const handleEnterStats = () => {
    setShowEnterStatsPopup(true);
  };

  if (showEnterStatsPopup) {
    return (
      <UnosStatistike id={id} onClose={() => setShowEnterStatsPopup(false)} />
    );
  }

  if (showMatchDetails) {
    return <StatistikaMeca id={id} onClose={onClose} />;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="player-stats">
          <h3 className="team-title">{playerStats.homeName}</h3>
          <div className="player-list">
            {playerStats.homeTeam.map((igrac, index) => (
              <div key={index} className="player-item">
                <div className="player-name">
                  {igrac.ime + " " + igrac.prezime} (Pozicija: {igrac.pozicija})
                </div>
                <div className="player-stats-detail">
                  <div>Broj golova: {igrac.golovi}</div>
                  <div>Broj asistencija: {igrac.asistencije}</div>
                  <div>Broj faulova: {igrac.faulovi}</div>
                  <div>Broj žutih kartona: {igrac.zuti_kartoni}</div>
                  <div>Broj crvenih kartona: {igrac.crveni_kartoni}</div>
                  <div>Šutevi u okvir: {igrac.sutevi_u_gol}</div>
                  <div>Šutevi van okvira: {igrac.sutevi_van_gola}</div>
                </div>
              </div>
            ))}
          </div>
          <h3 className="team-title">{playerStats.awayName}</h3>
          <div className="player-list">
            {playerStats.awayTeam.map((igrac, index) => (
              <div key={index} className="player-item">
                <div className="player-name">
                  {igrac.ime + " " + igrac.prezime} (Pozicija: {igrac.pozicija})
                </div>
                <div className="player-stats-detail">
                  <div>Broj golova: {igrac.golovi}</div>
                  <div>Broj asistencija: {igrac.asistencije}</div>
                  <div>Broj faulova: {igrac.faulovi}</div>
                  <div>Broj žutih kartona: {igrac.zuti_kartoni}</div>
                  <div>Broj crvenih kartona: {igrac.crveni_kartoni}</div>
                  <div>Šutevi u okvir: {igrac.sutevi_u_gol}</div>
                  <div>Šutevi van okvira: {igrac.sutevi_van_gola}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="popup-buttons">
          <button className="stat-btn" onClick={handleMatchStats}>
            Statistika Meča
          </button>
          <button className="stat-btn" onClick={handlePlayerStats}>
            Statistika Igrača
          </button>
          {role === "admin" && matchStatus === "in_progress" && (
            <button className="stat-btn" onClick={handleEnterStats}>
              Unesi Statistiku
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatistikaIgraca;
