import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* 🌐 Asztali nézet */}
      <div className="navbar-container desktop-only">
        <ul className="nav-links">
          <li><NavLink to="/"><FaHome /> Főoldal</NavLink></li>
          <li><NavLink to="/login">👤 Belépés / Regisztráció</NavLink></li>
          <li><NavLink to="/termekek"><FaShoppingCart /> Termék figyelő</NavLink></li>
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
            <FaShoppingCart />
            <span>Árfigyelő</span>
          </NavLink>
          <NavLink to="/kedvencek" className="nav-icon">
            <FaHeart />
            <span>Kedvencek</span>
          </NavLink>
          <NavLink to="/login" className="nav-icon">
            <FaUser />
            <span>Profil</span>
          </NavLink>
          <button onClick={toggleMenu} className="nav-icon hamburger-btn" style={{ fontSize: '1.4rem', background: 'none', border: 'none', color: 'white' }}>
            <FaBars />
            <span style={{ fontSize: '0.75rem' }}>Menü</span>
          </button>
        </div>

        {menuOpen && (
          <div className="dropdown-menu">
            <NavLink to="/" onClick={toggleMenu}>🏠 Főoldal</NavLink>
            <NavLink to="/termekek" onClick={toggleMenu}>🛒 Árfigyelő</NavLink>
            <NavLink to="/kosar" onClick={toggleMenu}>🧵 Kosár</NavLink>
            <NavLink to="/kedvencek" onClick={toggleMenu}>❤️ Kedvencek</NavLink>
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
