// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";
import GuestLogin from "./Components/Login/GuestLogin";
import Navigacija from "./Components/Navigation/Navigacija";
import PrivatnaRuta from "./Components/PrivatnaRuta";
import Tournaments from "./Components/Turniri/Turniri";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigacija />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest" element={<GuestLogin />} />
          <Route
            path="/turniri"
            element={
              <PrivatnaRuta>
                <Tournaments />
              </PrivatnaRuta>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
