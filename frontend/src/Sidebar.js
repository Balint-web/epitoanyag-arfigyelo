import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaHeart } from 'react-icons/fa'; // Ikonok importálása
import './Sidebar.css';

function Sidebar() {
  // Aktív menüpont kezelése
  const [activeLink, setActiveLink] = useState('/');

  // Funkció, ami kiválasztja az aktív linket
  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">ChatGPT 4</div>

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
        Termék megfigyelő
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
    </div>
  );
}

export default Sidebar;
