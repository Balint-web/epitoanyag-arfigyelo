import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context";
import "./Navbar.css"; // ⬅️ Ne felejtsd el importálni a CSS-t

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="navbar-container">
      <ul className="nav-links">
        <li><NavLink to="/">Főoldal</NavLink></li>
        <li><NavLink to="/termekek">Termék megfigyelő</NavLink></li>
        <li><NavLink to="/kapcsolat">Kapcsolatok</NavLink></li>
        <li><NavLink to="/kosar">🛒 Kosár</NavLink></li>
        <li><NavLink to="/kedvencek">❤️ Kedvencek</NavLink></li>
      </ul>

      <div className="nav-auth">
        {user ? (
          <button onClick={logoutUser} className="logout-btn">
            👤 {user.name || "Profil"} (Kijelentkezés)
          </button>
        ) : (
          <>
            <NavLink to="/bejelentkezes">Bejelentkezés</NavLink>
            <NavLink to="/regisztracio">Regisztráció</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
