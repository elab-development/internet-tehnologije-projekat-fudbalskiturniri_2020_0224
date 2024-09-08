import axios from "axios";
import "./StatistikaMeca.css";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import StatistikaIgraca from "../StatistikaIgraca/StatistikaIgraca";
import UnosStatistike from "../UnosStatistike/UnosStatistike";
import Pusher from "pusher-js";

const StatistikaMeca = ({ id, onClose }) => {
  const [showMatchDetails, setShowMatchDetails] = useState(true);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showEnterStatsPopup, setShowEnterStatsPopup] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const location = useLocation();
  const { role } = location.state || {};

  useEffect(() => {
    const fetchMatchData = async () => {
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

        setMatchData(response.data);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };
    fetchMatchData();

    const pusher = new Pusher("1ef4a6a15882c25d1174", {
      cluster: "eu",
      encrypted: true,
    });

    const channel = pusher.subscribe("utakmica." + id);
    channel.bind("promena-statistika", function (data) {
      console.log("PUSHEEER");
      fetchMatchData();
    });

    return () => {
      pusher.unsubscribe("utakmica." + id);
    };
  }, []);

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
    return (
      <StatistikaIgraca
        id={id}
        onClose={onClose}
        matchStatus={matchData?.data.status}
      />
    );
  }

  if (showEnterStatsPopup) {
    return <UnosStatistike id={id} onClose={onClose} />;
  }

  if (!matchData) {
    return <div>Loading...</div>;
  }

  const calculateTeamStats = (tim) => {
    let yellowCards = 0;
    let redCards = 0;

    if (matchData) {
      tim.igraci.forEach((igrac) => {
        yellowCards += igrac.statistika_igraca.zuti_kartoni;
        redCards += igrac.statistika_igraca.crveni_kartoni;
      });
    }

    return { yellowCards, redCards };
  };

  const homeTeamStats = calculateTeamStats(matchData.data.domaci_tim);
  const awayTeamStats = calculateTeamStats(matchData.data.gostujuci_tim);

  const getPercentage = (domaciValue, gostujuciValue) => {
    const total = domaciValue + gostujuciValue;
    return total === 0 ? 50 : (domaciValue / total) * 100;
  };

  const getBarStyles = (domaciValue, gostujuciValue) => {
    const percentage = getPercentage(domaciValue, gostujuciValue);
    return {
      domaci_tim: `${percentage}%`,
      gostujuci_tim: `${100 - percentage}%`,
    };
  };

  const shotsStyles = getBarStyles(
    matchData.data.statistika_utakmice.sutevi_domacina,
    matchData.data.statistika_utakmice.sutevi_gosta
  );
  const shotsOnTargetStyles = getBarStyles(
    matchData.data.statistika_utakmice.sutevi_u_gol_domacina,
    matchData.data.statistika_utakmice.sutevi_van_gola_domacina
  );
  const shotsOffTargetStyles = getBarStyles(
    matchData.data.statistika_utakmice.sutevi_van_gola_domacina,
    matchData.data.statistika_utakmice.sutevi_van_gola_gosta
  );
  const possessionStyles = getBarStyles(
    matchData.data.statistika_utakmice.posed_lopte_domacina,
    matchData.data.statistika_utakmice.posed_lopte_gosta
  );
  const yellowCardsStyles = getBarStyles(
    homeTeamStats.yellowCards,
    awayTeamStats.yellowCards
  );
  const redCardsStyles = getBarStyles(
    homeTeamStats.redCards,
    awayTeamStats.redCards
  );

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="match-summary">
          <h2 className="match-title">
            {matchData.data.domaci_tim.naziv} {matchData.data.golovi_domaci_tim}{" "}
            - {matchData.data.golovi_gostujuci_tim}{" "}
            {matchData.data.gostujuci_tim.naziv}
          </h2>
        </div>
        <div className="match-stats">
          {/* Shots */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {matchData.data.statistika_utakmice.sutevi_domacina}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {matchData.data.statistika_utakmice.sutevi_gosta}
              </div>
            </div>
          </div>

          {/* Shots on Target */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI U OKVIR GOLA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {matchData.data.statistika_utakmice.sutevi_u_gol_domacina}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsOnTargetStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsOnTargetStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {matchData.data.statistika_utakmice.sutevi_u_gol_gosta}
              </div>
            </div>
          </div>

          {/* Shots off Target */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI VAN OKVIRA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {matchData.data.statistika_utakmice.sutevi_van_gola_domacina}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsOffTargetStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsOffTargetStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {matchData.data.statistika_utakmice.sutevi_van_gola_gosta}
              </div>
            </div>
          </div>

          {/* Possession */}
          <div className="stats-row">
            <div className="stat-label">POSED LOPTE (%)</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {matchData.data.statistika_utakmice.posed_lopte_domacina}%
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: possessionStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: possessionStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {matchData.data.statistika_utakmice.posed_lopte_gosta}%
              </div>
            </div>
          </div>

          {/* Yellow Cards */}
          <div className="stats-row">
            <div className="stat-label">BROJ ŽUTIH KARTONA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {homeTeamStats.yellowCards}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: yellowCardsStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: yellowCardsStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {awayTeamStats.yellowCards}
              </div>
            </div>
          </div>

          {/* Red Cards */}
          <div className="stats-row">
            <div className="stat-label">BROJ CRVENIH KARTONA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
                {homeTeamStats.redCards}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: redCardsStyles.domaci_tim }}
                />
                <div
                  className="bar-team2"
                  style={{ width: redCardsStyles.gostujuci_tim }}
                />
              </div>
              <div className="team-stats team2-stats">
                {awayTeamStats.redCards}
              </div>
            </div>
          </div>
        </div>
        <div className="popup-buttons">
          <button className="stat-btn" onClick={handleMatchStats}>
            Statistika Meča
          </button>
          {role !== "guest" && (
            <button className="stat-btn" onClick={handlePlayerStats}>
              Statistika Igrača
            </button>
          )}
          {role === "admin" && matchData.data.status === "in_progress" && (
            <button className="stat-btn" onClick={handleEnterStats}>
              Unesi Statistiku
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatistikaMeca;
