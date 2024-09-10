import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "../Navigation/Navigacija";
import "./SerieA.css";

const SerieA = () => {
  const [standings, setStandings] = useState([]);
  const [season, setSeason] = useState(2024);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tabela`, {
          params: { season: season },
        });
        setStandings(response.data.standings[0].table);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchData();
  }, [season]);

  const handleSeasonChange = (event) => {
    setSeason(event.target.value);
  };

  return (
    <div className="SerieA">
      <Navigacija role={window.sessionStorage.getItem("role")} />
      <h1>Tabela Talijanske Serie A</h1>
      <label htmlFor="season">Odabir sezone: </label>
      <select id="season" value={season} onChange={handleSeasonChange}>
        {Array.from({ length: 2024 - 2020 + 1 }, (_, i) => 2020 + i).map(
          (year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>

      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>Goals For</th>
            <th>Goals Against</th>
            <th>Goal Difference</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team.id}>
              <td>{team.position}</td>
              <td>
                <img
                  src={team.team.crest}
                  alt={team.team.name}
                  style={{ width: "30px", marginRight: "10px" }}
                />
                {team.team.name}
              </td>
              <td>{team.playedGames}</td>
              <td>{team.won}</td>
              <td>{team.draw}</td>
              <td>{team.lost}</td>
              <td>{team.goalsFor}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalDifference}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SerieA;
