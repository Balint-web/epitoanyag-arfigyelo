import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { useAuth } from "./Context";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* 🌐 Asztali nézet */}
      <div className="navbar-container desktop-only">
        <ul className="nav-links">
          <li><NavLink to="/"><FaHome /> Főoldal</NavLink></li>
          <li><NavLink to="/login">🕤 Belépés / Regisztráció</NavLink></li>
          <li><NavLink to="/termekek">📉 Árfigyelő</NavLink></li>
          <li><NavLink to="/kapcsolat"><FaHeart /> Kapcsolatok</NavLink></li>
          <li><NavLink to="/kosar">🧵 Kosár</NavLink></li>
          <li><NavLink to="/kedvencek">❤️ Kedvencek</NavLink></li>
          <li><NavLink to="/gyik">❓ GYIK</NavLink></li>
        </ul>
      </div>

      {/* 📱 Mobil nézet */}
      <div className="bottom-navbar mobile-only">
        <div className="nav-icons">
          <NavLink to="/" className="nav-icon">
            <FaHome />
            <span>Főoldal</span>
          </NavLink>
          <NavLink to="/termekek" className="nav-icon">
            <span className="emoji-icon" role="img" aria-label="árfigyelő">📉</span>
            <span>Árfigyelő</span>
          </NavLink>
          <NavLink to="/kosar" className="nav-icon">
            <FaShoppingCart />
            <span>Kosár</span>
          </NavLink>
          <NavLink to="/login" className="nav-icon">
            <FaUser />
            <span>Profil</span>
          </NavLink>
          <button onClick={toggleMenu} className="nav-icon hamburger-btn no-highlight">
            <FaBars />
            <span>Menü</span>
          </button>
        </div>

        {menuOpen && (
          <div className="dropdown-menu right-aligned">
            <NavLink to="/" onClick={toggleMenu}>🏠 Főoldal</NavLink>
            <NavLink to="/termekek" onClick={toggleMenu}>📉 Árfigyelő</NavLink>
            <NavLink to="/kosar" onClick={toggleMenu}>🧵 Kosár</NavLink>
            {user && <NavLink to="/kedvencek" onClick={toggleMenu}>❤️ Kedvencek</NavLink>}
            <NavLink to="/gyik" onClick={toggleMenu}>❓ GYIK</NavLink>
            <NavLink to="/kapcsolat" onClick={toggleMenu}>📞 Kapcsolat</NavLink>
            <NavLink to="/login" onClick={toggleMenu}>🔐 Bejelentkezés / Regisztráció</NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
