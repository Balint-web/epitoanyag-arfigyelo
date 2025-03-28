import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Context'; // saját context hook
import "./Bejelentkezes.css";

const Bejelentkezes = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth(); // contextből jön
  const navigate = useNavigate();  // navigációhoz

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://epitoanyag-arfigyelo.onrender.com/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ username: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data); // pl.: { name: "Máté", email: "mate@email.hu" }
        navigate("/");   // visszairányít a főoldalra
      } else {
        alert(data.detail || "Hibás bejelentkezési adatok");
      }

    } catch (err) {
      console.error("Bejelentkezési hiba:", err);
      alert("Nem sikerült csatlakozni a szerverhez.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />

        <h1>Bejelentkezés</h1>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-container">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="password">Jelszó:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="forgot-password-container">
          <Link to="/forgot-password" className="forgot-password-link">
            Elfelejtetted a jelszót?
          </Link>
        </div>

        <button type="submit" className="login-button">Bejelentkezés</button>
      </form>
    </div>
  );
};

export default Bejelentkezes;
