import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import l from "./login.module.css";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleInput(e) {
    let newUserData = { ...userData };
    newUserData[e.target.name] = e.target.value;
    setUserData(newUserData);
  }

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/login", userData)
      .then((response) => {
        if (response.data.success === true) {
          window.sessionStorage.setItem(
            "auth_token",
            response.data.access_token
          );
          window.sessionStorage.setItem("role", response.data.role);
          navigate("/turniri", { state: { role: response.data.role } });
        } else {
          setErrorMessage("Wrong email or password");
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred. Please try again.");
      });
  }

  return (
    <div className={l.home_body}>
      <div className={l.container}>
        <div className={l.form_container}>
          <h2 className={l.proba}>ULOGUJ SE</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div className={l.input_container}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onInput={(e) => handleInput(e)}
                required
              />
              <div className="icon">
                <i className="fas fa-envelope"></i>
              </div>
            </div>
            <div className={l.input_container}>
              <input
                type="password"
                name="password"
                placeholder="Lozinka"
                onInput={handleInput}
                required
              />
              <div className="icon">
                <i className="fas fa-lock"></i>
              </div>
            </div>

            <button type="submit" className={l.submit_btn}>
              ULOGUJ SE
            </button>
          </form>
          <p>
            Nemaš nalog?{" "}
            <Link to="/signup" className={l.link}>
              Registruj se
            </Link>
          </p>
          <p>
            <Link to="/guest" className={l.link}>
              Prijavi se kao gost
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
