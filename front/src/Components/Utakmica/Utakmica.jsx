import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./Utakmica.css";
import axios from "axios";
import Navigacija from "../Navigation/Navigacija";
// import MatchDetailsPopup from "./MatchDetailsPopup";
import Pusher from "pusher-js";
const Utakmica = () => {
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role } = state || {};
  const [stagesToShow, setStagesToShow] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the tournaments!", error);
      }
    };

    fetchTournaments();
  }, []);

  const fetchTournament = useCallback(async () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/turniri/${id}`,
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      };
      const response = await axios.request(config);
      setTournament(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the tournament!", error);
    } finally {
    }
  }, [id]);

  useEffect(() => {
    fetchTournament();

    const pusher = new Pusher("1ef4a6a15882c25d1174", {
      cluster: "eu",
      encrypted: true,
    });

    const channel = pusher.subscribe("tournament." + id);
    channel.bind("tournament-stats-updated", function (data) {
      fetchTournament();
    });

    return () => {
      pusher.unsubscribe("tournament." + id);
    };
  }, [id]);

  useEffect(() => {
    if (tournament) {
      setMatches(tournament.utakmice);
    }
  }, [tournament]);

  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const stages = generateStages(matches);
    console.log("Matches updated:", matches);
    updateStagesWithWinners(stages);
    setStagesToShow(stages);
  }, [matches]);
  const handleRefresh = () => {
    navigate(`/utakmice/${id}`, { state: { role } });
  };

  const handleBracketNavigation = () => {
    navigate(`/bracket/${id}`, { state: { role } });
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match.id);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedMatch(null);
    setShowPopup(false);
  };

  const updateMatchStatus = async (id, status) => {
    try {
      const config = {
        method: "put",
        url: `http://localhost:8000/api/utakmice/status/${id}`,
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
        data: { status },
      };
      await axios.request(config);

      fetchTournament();

      console.log(matches);
    } catch (error) {
      console.error(
        `There was an error updating the status of match ${id}!`,
        error
      );
    }
  };

  const updateWinner = async (id, status) => {
    try {
      const config = {
        method: "put",
        url: `http://localhost:8000/api/utakmice/finish/${id}`,
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      };
      const response = await axios.request(config);
      const updatedMatches = matches.map((utakmica) => {
        if (utakmica.id === id) {
          return { ...utakmica, status };
        }
        return utakmica;
      });
      if (response.data.stat === false) {
        alert(response.data.message);
      } else {
        console.log("Uspesno zavrsena utakmica");
        // setMatches(updatedMatches);
        fetchTournament();
      }
    } catch (error) {
      console.error(
        `There was an error updating the status of match ${id}!`,
        error
      );
    }
  };

  const handleStartMatch = (id) => {
    updateMatchStatus(id, "in_progress");
  };

  const handleEndMatch = (id) => {
    updateWinner(id, "completed");
  };

  const generateStages = (matches) => {
    const stages = {
      "Osmina finala": [],
      Četvrtfinale: [],
      Polufinale: [],
      Finale: [],
    };

    // Pronađi maksimalni broj_utakmice
    const maxNumGame = Math.max(
      ...matches.map((utakmica) => utakmica.broj_utakmice)
    );

    // Postavi faze na osnovu maksimalnog broj_utakmice
    let currentStage;
    let numGame = maxNumGame;

    for (let i = numGame; i >= 1; i--) {
      console.log(i);

      if (i <= 15 && i > 7) {
        currentStage = "Osmina finala";
      } else if (i <= 7 && i > 3) {
        currentStage = "Četvrtfinale";
      } else if (i <= 3 && i > 1) {
        currentStage = "Polufinale";
      } else if (i === 1) {
        currentStage = "Finale";
      }

      const matchesInStage = matches.filter(
        (utakmica) => utakmica.broj_utakmice === i
      );
      stages[currentStage].push(...matchesInStage);
    }

    console.log(stages);
    return stages;
  };

  const updateStagesWithWinners = (stages) => {
    const getNextMatch = (numGame) => {
      return matches.find((utakmica) => utakmica.broj_utakmice === numGame);
    };

    const updateMatch = (stageName, currentMatches) => {
      const nextStageMatches = stages[stageName];

      currentMatches.forEach((utakmica) => {
        const numGame = utakmica.broj_utakmice;
        const winner = utakmica.status === "completed" ? utakmica.winner : null;

        if (winner) {
          const nextMatch = nextStageMatches.find(
            (m) => m.broj_utakmice === Math.floor(numGame / 2)
          );
          if (nextMatch) {
            if (
              nextMatch.home_team &&
              !nextMatch.home_team.name.includes("Unknown Team") &&
              numGame % 2 !== 0
            ) {
              nextMatch.home_team = winner;
            } else if (
              nextMatch.away_team &&
              !nextMatch.away_team.name.includes("Unknown Team")
            ) {
              nextMatch.away_team = winner;
            }
          }
        } else {
        }
      });
    };

    // Ažuriraj mečeve za sve faze
    updateMatch("Četvrtfinale", stages["Osmina finala"]);
    updateMatch("Polufinale", stages["Četvrtfinale"]);
    updateMatch("Finale", stages["Polufinale"]);
  };

  const tournamentName = tournament?.naziv || "";

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="sidebar">
        <Navigacija role={role} />
        <h3>Svi Turniri</h3>
        <div className="tournaments-list">
          {tournaments &&
            tournaments.map((turnir) => (
              <div
                key={turnir.id}
                className="tournament-item"
                onClick={() =>
                  navigate(`/utakmice/${turnir.id}`, { state: { role } })
                }
              >
                <p>{turnir?.naziv}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="matches-container">
        <h2 className="tournament-title">{tournamentName}</h2>
        <div className="action-buttons">
          <button onClick={handleRefresh} className="action-btn">
            Mečevi
          </button>
          <button onClick={handleBracketNavigation} className="action-btn">
            Žreb
          </button>
        </div>
        {Object.entries(stagesToShow).map(
          ([stage, stageMatches]) =>
            stageMatches.length > 0 && (
              <div key={stage} className="stage-container">
                <h3 className="stage-title">{stage}</h3>
                <div className="matches-list">
                  {stageMatches.map((utakmica, index) => (
                    <div
                      key={utakmica.id}
                      className={`match-card ${
                        index % 2 === 1 ? "right" : "left"
                      }`}
                    >
                      <div className="match-info">
                        {utakmica.domaci_tim && utakmica.gostujuci_tim ? (
                          <>
                            {utakmica.domaci_tim.naziv} -{" "}
                            {utakmica.gostujuci_tim.naziv}
                          </>
                        ) : (
                          <span>
                            Trenutno nisu dostupne informacije o utakmici
                          </span>
                        )}
                      </div>
                      <div className={`match-status ${utakmica.status}`}>
                        {utakmica.status === "in_progress"
                          ? "U Toku"
                          : utakmica.status === "completed"
                          ? "Završena"
                          : utakmica.status === "not_started"
                          ? "Nije Počela"
                          : ""}
                      </div>
                      {utakmica.domaci_tim && utakmica.gostujuci_tim && (
                        <>
                          {role === "admin" &&
                            utakmica.status === "not_started" && (
                              <button
                                className="start-btn"
                                onClick={() => handleStartMatch(utakmica.id)}
                              >
                                Zapocni mec
                              </button>
                            )}
                          {role === "admin" &&
                            utakmica.status === "in_progress" && (
                              <button
                                className="end-btn"
                                onClick={() => handleEndMatch(utakmica.id)}
                              >
                                Zavrsi mec
                              </button>
                            )}
                          {(utakmica.status === "in_progress" ||
                            utakmica.status === "completed") && (
                            <button
                              className="stats-btn"
                              onClick={() => handleMatchClick(utakmica)}
                            >
                              Statistika
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
      {/* {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <MatchDetailsPopup id={selectedMatch} onClose={handleClosePopup} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Utakmica;
