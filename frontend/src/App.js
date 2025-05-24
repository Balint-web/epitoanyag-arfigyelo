import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Bejelentkezes from './Bejelentkezes';
import ForgotPassword from './ForgotPassword';
import Kapcsolat from './Kapcsolat';
import CookieConsent from "react-cookie-consent";

import { CartProvider } from "./Context";
import Kosar from "./Kosar";
import Kedvencek from "./Kedvencek";
import TermekFigyelo from "./TermekFigyelo";
import Navbar from "./Navbar";
import Login from './Login';
import Gyik from './Gyik';

function App() {

  // 🧪 Fejlesztéshez: mindig újra megjelenjen a cookie sáv
  document.cookie = "userConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // 🍪 Süti újranyitás gomb függvénye
  const resetCookieConsent = () => {
    document.cookie = "userConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />

          {/* Cookie sáv – stílus az App.css-ben */}
          <CookieConsent
            location="bottom"
            buttonText="Elfogadom"
            declineButtonText="Elutasítom"
            enableDeclineButton
            cookieName="userConsent"
            sameSite="Lax"
            expires={0} // csak session-re érvényes
            containerClasses="cookie-banner"
            contentClasses="cookie-text"
            buttonClasses="cookie-accept-button"
            declineButtonClasses="cookie-decline-button"
          >
            Ez a weboldal sütiket használ a felhasználói élmény javítása érdekében. A használat folytatásával hozzájárulsz a sütik alkalmazásához.
          </CookieConsent>

          {/* Oldaltartalom */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="home-page">
                  <div className="info-card">
                    <h2 className="main-title">Találd meg a legjobb árakat egyhelyen</h2>
                    <div className="intro-text">
                      <ul>
                        <li>📦 <strong>Naprakész árfigyelés:</strong> a legnagyobb webáruházak villanyszerelési termékeiről.</li>
                        <li>⚡ <strong>Gyors összehasonlítás:</strong> egyértelmű árak, kényelmes keresés.</li>
                        <li>🧠 <strong>Okos vásárlás:</strong> átlátható kezelőfelület, minimális időráfordítással.</li>
                        <li>💡 <strong>Spórolj időt, pénzt és energiát</strong> – építs tudatosan és hatékonyan!</li>
                      </ul>
                    </div>
                  </div>

                  {/* 🍪 Süti beállítások újramegnyitása */}
                  <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                      onClick={resetCookieConsent}
                      style={{
                        background: "transparent",
                        color: "#0ea5e9",
                        border: "none",
                        fontSize: "16px",
                        textDecoration: "underline",
                        cursor: "pointer"
                      }}
                    >
                      Süti beállítások módosítása
                    </button>
                  </div>
                </div>
              } />
              <Route path="/termekek" element={<TermekFigyelo />} />
              <Route path="/kapcsolat" element={<Kapcsolat />} />
              <Route path="/bejelentkezes" element={<Bejelentkezes />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
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
