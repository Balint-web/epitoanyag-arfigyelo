import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context";
import "./Navbar.css";

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar-container">
      <ul className="nav-links">
        <li><NavLink to="/">Főoldal</NavLink></li>
        <li><NavLink to="/termekek">Termék megfigyelő</NavLink></li>
        <li><NavLink to="/kapcsolat">Kapcsolatok</NavLink></li>
        <li><NavLink to="/kosar">🛒 Kosár</NavLink></li>
        <li><NavLink to="/kedvencek">❤️ Kedvencek</NavLink></li>

        {/* Ide jöhet a bejelentkezés / regisztráció is ugyanabban a sorban */}
        {user ? (
          <li>
            <button onClick={logoutUser} className="logout-btn">
              👤 {user.name || "Profil"} (Kijelentkezés)
            </button>
          </li>
        ) : (
          <>
            <li><NavLink to="/bejelentkezes">Bejelentkezés</NavLink></li>
            <li><NavLink to="/regisztracio">Regisztráció</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
