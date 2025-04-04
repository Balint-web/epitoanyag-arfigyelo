import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context";
import { FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa'; // Ikonok importálása
import "./Navbar.css";

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="navbar-container">
      {/* Legjobb árak szöveg */}
      <div className="logo">
             </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/">
            <FaHome /> Főoldal
          </NavLink>
        </li>
	<li>
  		<NavLink to="/login">
    		👤Belépés / Regisztráció
  		</NavLink>
	</li>
        <li>
          	<NavLink to="/termekek">
            	<FaShoppingCart /> Termék figyelő
          </NavLink>
        </li>
        <li>
          	<NavLink to="/kapcsolat">
            	<FaHeart /> Kapcsolatok
          </NavLink>
        </li>
        <li>
         	 <NavLink to="/kosar">
           	 🛒 Kosár
          </NavLink>
        </li>
        <li>
          	<NavLink to="/kedvencek">
           	❤️ Kedvencek
          </NavLink>
        </li>
	<li>
  		<NavLink to="/gyik">
    		❓ GYIK
 	 </NavLink>
	</li>
	
      </ul>

    </div>
  );
};

export default Navbar;
