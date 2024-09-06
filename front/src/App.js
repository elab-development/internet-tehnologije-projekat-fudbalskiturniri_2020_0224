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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
