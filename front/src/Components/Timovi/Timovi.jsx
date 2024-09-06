import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Timovi.css";
import Navigacija from "../Navigation/Navigacija";
const Timovi = () => {
  const [teams, setTeams] = useState([]);
  const location = useLocation();
  const { role } = location.state || {};

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8000/api/timovi",
          headers: {
            Authorization:
              "Bearer " + window.sessionStorage.getItem("auth_token"),
          },
        };

        const response = await axios.request(config);
        const teamsData = response.data.data.map((tim) => ({
          id: tim.id,
          naziv: tim.naziv,
          igraci: tim.igraci.map((igrac) => igrac.ime + " " + igrac.prezime),
        }));
        setTeams(teamsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="teams-container">
      <Navigacija role={role} />
      <h1 className="title">SVI TIMOVI</h1>
      <div className="teams-list">
        {teams.map((tim) => (
          <div key={tim.id} className="team-card">
            <h3>{tim.naziv}</h3>
            <h3>{tim.mesto}</h3>
            <ul className="players-list">
              {tim.igraci.map((igrac, index) => (
                <li key={index}>{igrac}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timovi;
