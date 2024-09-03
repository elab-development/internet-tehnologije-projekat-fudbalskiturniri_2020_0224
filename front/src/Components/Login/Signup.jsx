import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import l from "./login.module.css";
const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  function handleInput(e) {
    // console.log(e);
    let newUserData = userData;
    newUserData[e.target.name] = e.target.value;
    console.log(newUserData);
    setUserData(newUserData);
  }

  let navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/register", userData)
      .then((response) => {
        if (response.data.success === false) {
          console.log(response.data.data);
        } else {
          console.log(response.data);
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <body className={l.home_body}>
      <div className={l.container}>
        <div className={l.form_container}>
          <h2 className={l.proba}>REGISTRACIJA</h2>
          <form onSubmit={handleRegister}>
            <div className={l.input_container}>
              <input
                type="text"
                placeholder="Korisničko ime"
                name="username"
                onInput={(e) => handleInput(e)}
                required
              />
              <div className="icon">
                <i className="fas fa-user"></i>
              </div>
            </div>
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
                placeholder="Lozinka"
                name="password"
                onInput={(e) => handleInput(e)}
                required
              />
              <div className="icon">
                <i className="fas fa-lock"></i>
              </div>
            </div>
            <div className={l.input_container}>
              <input
                type="password"
                placeholder="Potvrdi lozinku"
                name="password_confirmation"
                onInput={(e) => handleInput(e)}
                required
              />
              <div className="icon">
                <i className="fas fa-lock"></i>
              </div>
            </div>

            <button type="submit" className={l.submit_btn}>
              REGISTRACIJA
            </button>
          </form>
          <p>
            Već imaš nalog?{" "}
            <Link to="/" className={l.link}>
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </body>
  );
};

export default Signup;
