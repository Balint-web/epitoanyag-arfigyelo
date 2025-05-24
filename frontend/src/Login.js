import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import { useAuth } from './Context';
import loginImage from './login.png';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Ellenőrzés: minden mező ki van-e töltve
    if (!email || !password || (!isLogin && !password2)) {
      setMessage("❌ Kérlek töltsd ki az összes mezőt!");
      return;
    }

    // Email formátum ellenőrzés: kell benne @ és pont is
    if (!email.includes('@') || !email.split('@')[1]?.includes('.')) {
      setMessage("❌ Kérlek valós email címet adj meg! (Pl: valami@valami.hu)");
      return;
    }

    // Ha regisztráció van: jelszavak egyezése + minimum követelmények
    if (!isLogin) {
      if (password !== password2) {
        setMessage("❌ A két jelszó nem egyezik!");
        return;
      }
      if (password.length < 8) {
        setMessage("❌ A jelszónak legalább 8 karakter hosszúnak kell lennie!");
        return;
      }
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        setMessage("❌ A jelszónak tartalmaznia kell legalább egy nagybetűt és egy számot!");
        return;
      }
    }

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:8000/api/users/custom-login/", { email, password });
        localStorage.setItem("token", res.data.token || res.data.key);
        setMessage("✅ Sikeres bejelentkezés!");
        loginUser?.({ email });
        setTimeout(() => navigate("/"), 1000);
      } else {
        const res = await axios.post("http://localhost:8000/api/auth/registration/", {
          email,
          password1: password,
          password2,
          username: email
        });
        setMessage("✅ Sikeres regisztráció!");
        localStorage.setItem("token", res.data.key);
        loginUser?.({ email });
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
    <div className="login-wrapper">
      <div className="login-box">
        <div className="logo-container">
          <img src={loginImage} alt="Bejelentkezés" className="logo" />
          <h2>{isLogin ? "Bejelentkezés" : "Regisztráció"}</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="email">Email cím:</label>
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

          <Link to="/forgot-password" className="forgot-password-button">
            Elfelejtetted a jelszót?
          </Link>

          <button type="submit" className="login-button">
            {isLogin ? "Bejelentkezés" : "Regisztráció"}
          </button>
        </form>

        {message && (
          <p className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <div className="register-section">
          {isLogin ? "Nincs fiókod?" : "Van már fiókod?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Regisztrálj itt" : "Lépj be"}
          </button>
        </div>
      </div>
    </div>
  );
}
