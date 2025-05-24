import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaHeart, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from './Context'; // ✅

function Sidebar() {
  const [activeLink, setActiveLink] = useState('/');
  const { user, logoutUser } = useAuth(); // ✅
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login"); // irányítsuk vissza a login oldalra
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Árfigyelő</div>

      <Link 
        to="/" 
        className={`sidebar-link ${activeLink === '/' ? 'active' : ''}`} 
        onClick={() => handleLinkClick('/')}
      >
        <FaHome className="sidebar-icon" />
        Főoldal
      </Link>

      <Link 
        to="/termekfigyelo" 
        className={`sidebar-link ${activeLink === '/termekfigyelo' ? 'active' : ''}`} 
        onClick={() => handleLinkClick('/termekfigyelo')}
      >
        <FaSearch className="sidebar-icon" />
        Árfigyelő
      </Link>

      <Link 
        to="/kapcsolat" 
        className={`sidebar-link ${activeLink === '/kapcsolat' ? 'active' : ''}`} 
        onClick={() => handleLinkClick('/kapcsolat')}
      >
        <FaShoppingCart className="sidebar-icon" />
        Kosár
      </Link>

      <Link 
        to="/kedvencek" 
        className={`sidebar-link ${activeLink === '/kedvencek' ? 'active' : ''}`} 
        onClick={() => handleLinkClick('/kedvencek')}
      >
        <FaHeart className="sidebar-icon" />
        Kedvencek
      </Link>

      {/* ✅ Bejelentkezés helyett Kijelentkezés, ha van user */}
      {user ? (
        <button className="sidebar-link" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" />
          Kijelentkezés
        </button>
      ) : (
        <Link 
          to="/login" 
          className={`sidebar-link ${activeLink === '/login' ? 'active' : ''}`} 
          onClick={() => handleLinkClick('/login')}
        >
          <FaSignInAlt className="sidebar-icon" />
          Belépés / Regisztráció
        </Link>
      )}
    </div>
  );
}

export default Sidebar;