// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import GuestLogin from "./Components/Login/GuestLogin";
import PrivatnaRuta from "./Components/PrivatnaRuta";
import Turniri from "./Components/Turniri/Turniri";
import NapraviTurnir from "./Components/KreiranjeTurnira/NapraviTurnir";
import DodajTim from "./Components/DodajTim/DodajTim";
import NapraviTim from "./Components/NapraviTim/NapraviTim";
import Timovi from "./Components/Timovi/Timovi";
import Igraci from "./Components/Igraci/Igraci";
import Omiljeni from "./Components/Omiljeni/Omiljeni";
import Utakmica from "./Components/Utakmica/Utakmica";
import Bracket from "./Components/Bracket/Bracket";
import SerieA from "./Components/SerieA/SerieA";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest" element={<GuestLogin />} />
          <Route
            path="/turniri"
            element={
              <PrivatnaRuta>
                <Turniri />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/napravi-turnir"
            element={
              <PrivatnaRuta>
                <NapraviTurnir />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/dodaj-tim"
            element={
              <PrivatnaRuta>
                <DodajTim />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/napravi-tim"
            element={
              <PrivatnaRuta>
                <NapraviTim />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/timovi"
            element={
              <PrivatnaRuta>
                <Timovi />
              </PrivatnaRuta>
            }
          />

          <Route
            path="/utakmice/:id"
            element={
              <PrivatnaRuta>
                <Utakmica />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/bracket/:id"
            element={
              <PrivatnaRuta>
                <Bracket />
              </PrivatnaRuta>
            }
          />

          <Route
            path="/igraci"
            element={
              <PrivatnaRuta>
                <Igraci />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/omiljeni"
            element={
              <PrivatnaRuta>
                <Omiljeni />
              </PrivatnaRuta>
            }
          />
          <Route
            path="/serie-a"
            element={
              <PrivatnaRuta>
                <SerieA />
              </PrivatnaRuta>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
