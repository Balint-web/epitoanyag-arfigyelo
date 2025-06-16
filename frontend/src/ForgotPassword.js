import React, { useState } from 'react';
import './ForgotPassword.css';
import loginImage from './login.png'; // Logó

// CSRF token lekérő függvény
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const csrftoken = getCookie("csrftoken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/password/reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        },
        credentials: "include", // fontos a CSRF miatt!
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setMessage("✅ A jelszó visszaállító email elküldve! Nézd meg a postafiókodat.");
      } else {
        const data = await response.json();
        setError("❌ Hiba: " + (data.detail || "Ismeretlen hiba"));
      }
    } catch (err) {
      setError("❌ Hálózati hiba: " + err.message);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <img src={loginImage} alt="Jelszó visszaállítás" className="logo" />

        <h2>Jelszó visszaállítása</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Írd be az email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Új jelszó kérése</button>
        </form>

        {message && (
          <p className="message success">{message}</p>
        )}

        {error && (
          <p className="message error">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
