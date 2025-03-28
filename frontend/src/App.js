import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Bejelentkezes from './Bejelentkezes'; // Ellenőrizd, hogy helyes az útvonal
import ForgotPassword from './ForgotPassword'; // A jelszó visszaállítási oldal importálása
import Kapcsolat from './Kapcsolat'; // A Kapcsolat komponens importálása
import Regisztracio from './Regisztracio'; // Importálás
import { CartProvider } from "./Context";
import Kosar from "./Kosar";
import Kedvencek from "./Kedvencek";
import TermekFigyelo from "./TermekFigyelo";
import Navbar from "./Navbar"; // új sor



function App() { // itt van a háttérkép beállításai
	 
  const appStyle = {
   	backgroundImage: 'url(/images/f.jpg)',
  	backgroundSize: 'cover', // "auto" vagy "contain" itt kell állítani contain vagy másra
   	backgroundRepeat: 'no-repeat',
    	backgroundPosition: 'center',
    	width: "100%",	
    	minHeight: '100vh',
	backgroundAttachment: "fixed", //háttér fix marad
  	overflow: "hidden", // elkerüli a nemkivánatos görgetést
	margin: "0",
	padding:"0",
	position: 'relative', // hozzáadva a relative pozicionálás
  };

  const overlayStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Áttetsző sötét háttér
    zIndex: -1, // A háttér alatt helyezkedjen el
  };

  return (
   <CartProvider>
    <Router>
      <div className="App" style={appStyle}>
	{/* Az overlay elem hozzáadása */}
        <div style={overlayStyle}></div>
        {/* Logó beillesztése */}

        <header className="header">
          <h1>Legjobb árak egy helyen</h1>
        </header>

	{/* Navigációs menü */}
        <Navbar /> {/* <- EZ AZ ÚJ NAVIGÁCIÓ */}
          
	 {/* Útvonalak */}

        <Routes>
	<Route path="/" element={
            <div className="home-page">
              <div className="info-card">
                <h2>Minden amit egy kölcséghatékony bevásárlásról tudni lehet</h2>
                <p className="intro-text">
      Spórolj időt és pénzt velünk!  A weboldalunk az építőanyagok árainak összehasonlítására 
      specializálódott, kiemelt figyelmet fordítva a villanyszerelési termékekre. 
      Folyamatosan frissülő adatbázisunk segít abban, hogy mindig a legjobb ajánlatot találd meg! 
      <br /><br />
      🔹 Böngéssz egyszerűen és átláthatóan!<br />
      🔹 Találd meg a legjobb árakat másodpercek alatt!<br />
      🔹 Ne fizess többet feleslegesen – mi segítünk a döntésben!<br /><br />
      Ne hagyd, hogy az árak meglepjenek! Használj minket, és vásárolj okosabban! 
    </p>
              </div>
            </div>
          } />
          <Route path="/" element={<div className="home-page"><h2>Üdvözöllek a Főoldalon!</h2></div>} />
          <Route path="/termekek" element={<TermekFigyelo />} />
          <Route path="/kapcsolat" element={<Kapcsolat />} />
          <Route path="/bejelentkezes" element={<Bejelentkezes />} />
	  <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
	  <Route path="/kosar" element={<Kosar />} />
          <Route path="/kedvencek" element={<Kedvencek />} />
        </Routes>
      </div>
    </Router>
 </CartProvider>
  );
}




export default App;
