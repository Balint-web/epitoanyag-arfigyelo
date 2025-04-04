import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Bejelentkezes from './Bejelentkezes';
import ForgotPassword from './ForgotPassword';
import Kapcsolat from './Kapcsolat';
import Regisztracio from './Regisztracio';
import { CartProvider } from "./Context";
import Kosar from "./Kosar";
import Kedvencek from "./Kedvencek";
import TermekFigyelo from "./TermekFigyelo";
import Navbar from "./Navbar";
import Login from './Login';
import Gyik from './Gyik';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          {/* Navigációs menü */}
          <Navbar />

          

          {/* Útvonalak */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="home-page">
                  <div className="info-card">
                    <h2>Minden amit egy költséghatékony bevásárlásról tudni lehet</h2>
                    <p className="intro-text">
                      Spórolj időt és pénzt velünk! A weboldalunk az építőanyagok árainak összehasonlítására
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
              <Route path="/termekek" element={<TermekFigyelo />} />
              <Route path="/kapcsolat" element={<Kapcsolat />} />
              <Route path="/bejelentkezes" element={<Bejelentkezes />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/regisztracio" element={<Regisztracio />} />
              <Route path="/kosar" element={<Kosar />} />
              <Route path="/kedvencek" element={<Kedvencek />} />
              <Route path="/login" element={<Login />} />
	      <Route path="/gyik" element={<Gyik />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
