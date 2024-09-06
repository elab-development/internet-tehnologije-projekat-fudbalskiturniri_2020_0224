import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Igraci.css";
import Navigacija from "../Navigation/Navigacija";
import Pagination from "../Paginacija/Pagination";

const Igraci = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || null);

  useEffect(() => {
    const fetchPlayers = async (page) => {
      setLoading(true);

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/igraci/kumulativna_statistika?page=${page}`,
        headers: {
          Authorization:
            "Bearer " + window.sessionStorage.getItem("auth_token"),
        },
      };

      axios
        .request(config)
        .then((response) => {
          setPlayers(response.data.data);
          setTotalPages(response.data.meta.last_page);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };

    if (!role) {
      setRole(location.state?.role || ""); // Postavljanje role ako nije setovano
    }

    fetchPlayers(currentPage);
  }, [currentPage, role, location.state]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="players-container">
      <Navigacija role={role} />
      <h1>SVI IGRAČI</h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <div>
          <div className="players-list-2">
            {players.map((igrac) => (
              <div key={igrac.id} className="player-card">
                <h3>{igrac.ime}</h3>
                <h3>{igrac.prezime}</h3>
                <p>Pozicija: {igrac.pozicija}</p>
                <div className="player-stats">
                  <p>Golovi: {igrac.kumulativna_statistika.golovi}</p>
                  <p>Asistencije: {igrac.kumulativna_statistika.asistencije}</p>
                  <p>Faulovi: {igrac.kumulativna_statistika.faulovi}</p>
                  <p>
                    Žuti Kartoni: {igrac.kumulativna_statistika.zuti_kartoni}
                  </p>
                  <p>
                    Crveni Kartoni:{" "}
                    {igrac.kumulativna_statistika.crveni_kartoni}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Igraci;
