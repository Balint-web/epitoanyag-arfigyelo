import React, { useState } from "react";
import { useCart, useAuth } from "./Context";
import { Navigate } from "react-router-dom";
import './Kedvencek.css';

export default function Kedvencek() {
  const { favorites, removeFromFavorites } = useCart();
  const { user } = useAuth();
  const [selectedStore, setSelectedStore] = useState("");

  if (!user) {
    //  Ha nincs bejelentkezve, átdobjuk a /login oldalra
    return <Navigate to="/login" replace />;
  }

  const filteredFavorites = selectedStore
    ? favorites.filter((item) =>
        item.offers.some((offer) => offer.store === selectedStore)
      )
    : favorites;

  return (
    <div className="kedvencek-container">
      <h2 className="kedvencek-title">❤️ Kedvenc Termékeim</h2>

      {/* Bolt szűrő */}
      <div className="filter-box">
        <label className="filter-label">Kedvenc bolt szűrés:</label>
        <select
          className="filter-select"
          onChange={(e) => setSelectedStore(e.target.value)}
          value={selectedStore}
        >
          <option value="">Összes</option>
          {[...new Set(favorites.flatMap(item => item.offers.map(offer => offer.store)))].map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="empty-message">
           Jelenleg nincsenek kedvenc termékek.
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map((item) => (
            <div key={item.id} className="favorite-card">
              {/* TERMÉK NEVE */}
              <h3 className="favorite-name">{item.name}</h3>

              {/* Boltok és árak */}
              <div className="store-price-grid">
                {item.offers.map((offer, index) => {
                  if (selectedStore && offer.store !== selectedStore) return null;
                  return (
                    <div key={index} className="store-block">
                      <p className="store-name">{offer.store}</p>
                      {offer.price ? (
                        <p className="store-price price-green">{offer.price} Ft</p>
                      ) : (
                        <p className="store-price price-red">❌ Nincs ár</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Törlés gomb */}
              <div className="favorite-buttons">
                <button onClick={() => removeFromFavorites(item.id)} className="remove-btn">
                  ❌ Törlés
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
