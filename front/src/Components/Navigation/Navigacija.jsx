import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigacija = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.sessionStorage.setItem("auth_token", null);
    navigate("/");
  };

  return (
    <nav className="navigation">
      <ul>
        {role === "admin" && (
          <li>
            <Link to="/napravi-turnir" state={{ role }}>
              Napravi novi turnir
            </Link>
          </li>
        )}
        <li>
          <Link to="/turniri" state={{ role }}>
            Pregled turnira
          </Link>
        </li>
        <li>
          <Link to="/timovi" state={{ role }}>
            Pregled ekipa
          </Link>
        </li>
        <li>
          <Link to="/igraci" state={{ role }}>
            Pregled igrača
          </Link>
        </li>
        {role === "user" && (
          <li>
            <Link to="/omiljeni" state={{ role }}>
              Omiljeno
            </Link>
          </li>
        )}
        {role === "user" && (
          <li>
            <Link to="/serie-a" state={{ role }}>
              Serie-a
            </Link>
          </li>
        )}
      </ul>
      <button onClick={handleLogout} className="logout-btn">
        Odjavi se
      </button>
    </nav>
  );
};

export default Navigacija;
