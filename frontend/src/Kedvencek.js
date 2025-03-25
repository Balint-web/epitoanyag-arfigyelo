import React, { useState } from "react";
import { useCart } from "./Context";
import './Kedvencek.css'; // ✅ Ne feledd behúzni a CSS fájlt!

const stores = [
  { name: "Daniella", icon: "🏬" },
  { name: "Mentavill", icon: "🏢" },
  { name: "Govill", icon: "🛒" },
  { name: "Mixvill", icon: "🏠" }
];

export default function Kedvencek() {
  const { favorites, removeFromFavorites, addToCart } = useCart();
  const [selectedStore, setSelectedStore] = useState("");

  const filteredFavorites = selectedStore
    ? favorites.filter((item) => item.store === selectedStore)
    : favorites;

  return (
    <div className="kedvencek-container">
      <h2 className="kedvencek-title">❤️ Kedvenceim</h2>

      {/* ✅ Bolt szűrő */}
      <div className="filter-box">
        <label className="filter-label">Kedvenc bolt szűrés:</label>
        <select
          className="filter-select"
          onChange={(e) => setSelectedStore(e.target.value)}
          value={selectedStore}
        >
          <option value="">Összes</option>
          {stores.map((store) => (
            <option key={store.name} value={store.name}>
              {store.icon} {store.name}
            </option>
          ))}
        </select>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="empty-message">
          😢 Jelenleg nincsenek kedvenc termékek.
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map((item) => (
            <div key={item.id} className="favorite-card">
              <img
                src={`https://via.placeholder.com/300x180.png?text=${encodeURIComponent(item.product)}`}
                alt={item.product}
                className="favorite-image"
              />
              <h3 className="favorite-name">{item.product}</h3>
              <p className="favorite-price">Ár: <span>{item.price} Ft</span></p>
              <p className="favorite-store">Bolt: {item.store}</p>

              <div className="favorite-buttons">
                <button onClick={() => addToCart(item)} className="cart-btn">🛒 Kosárba</button>
                <button onClick={() => removeFromFavorites(item.id)} className="remove-btn">❌ Törlés</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
