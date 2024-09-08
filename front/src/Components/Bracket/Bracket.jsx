import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./Bracket.css";
import Navigacija from "../Navigation/Navigacija";
import { toPng } from "html-to-image";
import Pusher from "pusher-js";
const Bracket = () => {
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role } = state || {};
  const [stagesToShow, setStagesToShow] = useState({});

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
    }
  }, [id]);

  useEffect(() => {
    fetchTournament();

    const pusher = new Pusher("1ef4a6a15882c25d1174", {
      cluster: "eu",
      encrypted: true,
    });

    const channel = pusher.subscribe("turnir." + id);
    channel.bind("tournament-stats-updated", function (data) {
      fetchTournament();
    });

    return () => {
      pusher.unsubscribe("turnir." + id);
    };
  }, [id]);

  useEffect(() => {
    if (tournament) {
      setMatches(tournament.utakmice);
      console.log(tournament.utakmice);
    }
  }, [tournament]);

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const stages = generateStages(matches);
    updateStagesWithWinners(stages);
    setStagesToShow(stages);
  }, [matches]);

  const generateStages = (matches) => {
    const stages = {
      "Osmina-finala": [],
      "Cetvrt-finale": [],
      "Polu-finale": [],
      "Finale.": [],
    };

    const maxNumGame = Math.max(
      ...matches.map((utakmica) => utakmica.broj_utakmice)
    );

    for (let i = maxNumGame; i >= 1; i--) {
      let currentStage;

      if (i <= 15 && i > 7) {
        currentStage = "Osmina-finala";
      } else if (i <= 7 && i > 3) {
        currentStage = "Cetvrt-finale";
      } else if (i <= 3 && i > 1) {
        currentStage = "Polu-finale";
      } else if (i === 1) {
        currentStage = "Finale.";
      }

      const matchesInStage = matches.filter(
        (utakmica) => utakmica.broj_utakmice === i
      );
      stages[currentStage].push(...matchesInStage);
    }
    return stages;
  };

  const updateStagesWithWinners = (stages) => {
    const updateMatch = (stageName, currentMatches) => {
      console.log(currentMatches);
      const nextStageMatches = stages[stageName];
      currentMatches.forEach((utakmica) => {
        const winner =
          utakmica.status === "completed" ? utakmica.pobednik : null;
        if (winner) {
          const nextMatch = nextStageMatches.find(
            (m) => m.broj_utakmice === Math.floor(utakmica.broj_utakmice / 2)
          );
          if (nextMatch) {
            if (
              !nextMatch.domaci_tim ||
              nextMatch.domaci_tim.naziv.includes("Nepoznat tim")
            ) {
              nextMatch.domaci_tim = winner;
            } else if (
              !nextMatch.gostujuci_tim ||
              nextMatch.gostujuci_tim.naziv.includes("Nepoznat tim")
            ) {
              nextMatch.gostujuci_tim = winner;
            }
          }
        }
      });
    };

    updateMatch("Cetvrt-finale", stages["Osmina-finala"]);
    updateMatch("Polu-finale", stages["Cetvrt-finale"]);
    updateMatch("Finale.", stages["Polu-finale"]);
  };

  const handleMatchesNavigation = () => {
    navigate(`/utakmice/${id}`, { state: { role } });
  };

  const handleRefresh = () => {
    navigate(`/bracket/${id}`, { state: { role } });
  };

  const handleTournamentClick = (turnir) => {
    navigate(`/bracket/${turnir.id}`, { state: { role } });
  };

  const tournamentName = tournament?.naziv || "";

  const handleExportClick = () => {
    const bracketElement = document.querySelector(".bracket-match");
    if (bracketElement) {
      toPng(bracketElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${tournamentName}_bracket.png`;
          link.click();
        })
        .catch((err) => {
          console.error("Failed to generate image:", err);
        });
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bracket-container">
      <div className="sidebar">
        <Navigacija role={role} />
        <h3>Svi Turniri</h3>
        <div className="tournaments-list">
          {tournaments &&
            tournaments.map((turnir) => (
              <div
                key={turnir.id}
                className="tournament-item"
                onClick={() => handleTournamentClick(turnir)}
              >
                <p>{turnir.naziv}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="bracket-content">
        <h2 className="tournament-title">{tournamentName}</h2>
        <div className="action-buttons">
          <button onClick={handleMatchesNavigation} className="action-btn">
            Mečevi
          </button>
          <button onClick={handleRefresh} className="action-btn">
            Žreb
          </button>
          <button onClick={handleExportClick} className="action-btn">
            Sačuvaj kao sliku
          </button>
        </div>
        <div className="bracket-match">
          {Object.entries(stagesToShow).map(
            ([stage, stageMatches]) =>
              stageMatches.length > 0 && (
                <div
                  key={stage}
                  className={`bracket-column ${stage
                    .toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  <h2 className="phase-title">{stage}</h2>
                  {stageMatches.map((utakmica) => (
                    <div key={utakmica.id} className="bracket-card">
                      {utakmica.domaci_tim?.naziv || "Nepoznat tim"}{" "}
                      {utakmica.golovi_domaci_tim === 0 &&
                      utakmica.golovi_gostujuci_tim === 0
                        ? " : "
                        : `${
                            utakmica.golovi_domaci_tim !== null
                              ? utakmica.golovi_domaci_tim
                              : ""
                          } : ${
                            utakmica.golovi_gostujuci_tim !== null
                              ? utakmica.golovi_gostujuci_tim
                              : ""
                          }`}{" "}
                      {utakmica.gostujuci_tim?.naziv || "Nepoznat tim"}
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Bracket;
