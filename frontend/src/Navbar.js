import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaHome, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from "./Context";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const [showMessage, setShowMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    setShowMessage("✅ Sikeresen kijelentkeztél!");
    setTimeout(() => {
      setFadeOut(true);
    }, 2500);
    setTimeout(() => {
      setShowMessage("");
      setFadeOut(false);
    }, 3500);
    navigate("/login");
  };

  return (
    <>
      {showMessage && (
        <div className={`popup-message ${fadeOut ? 'fade-out' : ''}`}>
          {showMessage}
        </div>
      )}

      {/* 🌐 Asztali nézet */}
      <div className="navbar-container desktop-only">
        <ul className="nav-links">
          <li><NavLink to="/"><FaHome /> Főoldal</NavLink></li>
          {!user && <li><NavLink to="/login"><FaUser /> Belépés / Regisztráció</NavLink></li>}
          <li><NavLink to="/termekek">📉 Árfigyelő</NavLink></li>
          <li><NavLink to="/kapcsolat">⭐ Kapcsolatok</NavLink></li>
          <li><NavLink to="/kosar">🛒 Kosár</NavLink></li>
          <li><NavLink to="/kedvencek">❤️ Kedvencek</NavLink></li>
          <li><NavLink to="/gyik">❓ GYIK</NavLink></li>
          {user && (
            <li>
              <button onClick={handleLogout} className="nav-button">
                <FaSignOutAlt /> Kijelentkezés
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* 📱 Tablet nézet (769px - 1024px) */}
      <div className="tablet-navbar tablet-only">
        <div className="tablet-top-bar">
          <div className="tablet-left-group">
            <button onClick={toggleMenu} className="hamburger-btn no-highlight">
              <FaBars />
            </button>
            <NavLink to="/termekek" className="tablet-logo">
              <span className="emoji-icon" role="img" aria-label="árfigyelő">📉</span>
              <span className="tablet-logo-text">Árfigyelő</span>
            </NavLink>
          </div>
          {!user && <NavLink to="/login" className="tablet-login"><FaUser /> Bejelentkezés</NavLink>}
          {user && <button onClick={handleLogout} className="tablet-login nav-button"><FaSignOutAlt /> Kijelentkezés</button>}
        </div>
        {menuOpen && (
          <div className="tablet-dropdown">
            <NavLink to="/" onClick={toggleMenu}><FaHome /> Főoldal</NavLink>
            <NavLink to="/kapcsolat" onClick={toggleMenu}>⭐ Kapcsolat</NavLink>
            <NavLink to="/gyik" onClick={toggleMenu}>❓ GYIK</NavLink>
            <NavLink to="/kosar" onClick={toggleMenu}>🛒 Kosár</NavLink>
            {user && <NavLink to="/kedvencek" onClick={toggleMenu}>❤️ Kedvencek</NavLink>}
          </div>
        )}
      </div>

      {/* 📱 Mobil nézet */}
      <div className="bottom-navbar mobile-only">
        <div className="nav-icons">
          <NavLink to="/" className="nav-icon"><FaHome /><span>Főoldal</span></NavLink>
          <NavLink to="/termekek" className="nav-icon">📉<span>Árfigyelő</span></NavLink>
          <NavLink to="/kosar" className="nav-icon"><FaShoppingCart /><span>Kosár</span></NavLink>
          {!user && <NavLink to="/login" className="nav-icon"><FaUser /><span>Profilom</span></NavLink>}
          {user && <button onClick={handleLogout} className="nav-icon nav-button"><FaSignOutAlt /><span>Kijelentkezés</span></button>}
          <button onClick={toggleMenu} className="nav-icon hamburger-btn"><FaBars /><span>Menü</span></button>
        </div>

        {menuOpen && (
          <div className="dropdown-menu right-aligned">
            {user && <NavLink to="/kedvencek" onClick={toggleMenu}>❤️ Kedvencek</NavLink>}
            <NavLink to="/gyik" onClick={toggleMenu}>❓ GYIK</NavLink>
            <NavLink to="/kapcsolat" onClick={toggleMenu}>⭐ Kapcsolat</NavLink>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
