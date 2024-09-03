import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import qs from "qs";

const GuestLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = qs.stringify({
      email: "gost@gmail.com",
      password: "password",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/login",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.success === true) {
          window.sessionStorage.setItem(
            "auth_token",
            response.data.access_token
          );
          window.sessionStorage.setItem("role", response.data.role);
          navigate("/turniri", { state: { role: response.data.role } });
        } else {
          console.error("Wrong email or password");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]);

  return (
    <div>
      <h2>Logging in as Guest...</h2>
    </div>
  );
};

export default GuestLogin;
