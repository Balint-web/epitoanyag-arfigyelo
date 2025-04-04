import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useAuth } from './Context'; // Ha használod

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth(); // Opcionális, ha használod

  const API_BASE = "http://localhost:8000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/login/`, { email, password });
        setMessage("Sikeres bejelentkezés ✅");
        localStorage.setItem("token", res.data.key);
        loginUser?.({ email }); // opcionális
        setTimeout(() => navigate("/"), 1000);
      } else {
        if (password !== password2) {
          setMessage("A jelszavak nem egyeznek ❌");
          return;
        }
        const res = await axios.post(`${API_BASE}/registration/`, {
          email,
          password1: password,
          password2,
        });
        setMessage("Sikeres regisztráció ✅");
        localStorage.setItem("token", res.data.key);
        loginUser?.({ email }); // opcionális
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        const msg =
          errors.non_field_errors?.[0] ||
          errors.email?.[0] ||
          errors.password1?.[0] ||
          errors.password?.[0] ||
          errors.detail ||
          "Ismeretlen hiba történt.";
        setMessage(`❌ ${msg}`);
      } else {
        setMessage("❌ Hálózati hiba: " + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <h1>{isLogin ? "Bejelentkezés" : "Regisztráció"}</h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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

        {!isLogin && (
          <div className="input-container">
            <label htmlFor="password2">Jelszó újra:</label>
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
        )}

        <div className="forgot-password-container">
          <a href="/forgot-password" className="forgot-password-link">
            Elfelejtetted a jelszót?
          </a>
        </div>

        <button type="submit" className="login-button">
          {isLogin ? "Bejelentkezés" : "Regisztráció"}
        </button>
      </form>

      {message && (
        <p className="message text-center mt-3 text-sm text-gray-700">{message}</p>
      )}

      <p className="text-sm text-center mt-4">
        {isLogin ? "Nincs fiókod?" : "Van már fiókod?"}{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Regisztrálj itt" : "Lépj be"}
        </button>
      </p>
    </div>
  );
}
