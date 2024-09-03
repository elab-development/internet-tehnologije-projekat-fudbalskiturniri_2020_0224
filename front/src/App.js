// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
// import GuestLogin from "./Components/GuestLogin";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/guest" element={<GuestLogin />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
