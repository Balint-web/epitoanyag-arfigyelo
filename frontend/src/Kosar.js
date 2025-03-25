import React, { useState } from "react";
import { useCart } from "./Context";
import './Kosar.css';

const stores = [
  { name: "Daniella", icon: "🏬" },
  { name: "Mentavill", icon: "🏢" },
  { name: "Govill", icon: "🛒" },
  { name: "Mixvill", icon: "🏠" }
];

export default function Kosar() {
  const { cart, removeFromCart } = useCart();
  const [selectedStore, setSelectedStore] = useState("");

  const getStorePrice = (product, store) => (product.store === store ? product.price : null);

  const storeTotals = stores.map((store) => {
    let total = 0;
    cart.forEach((product) => {
      const price = getStorePrice(product, store.name);
      if (price) total += price;
    });
    return { store: store.name, total };
  });

  return (
    <div className="kosar-container">
      <h2 className="kosar-title">🛒 Kosár - Ár összehasonlítás</h2>

      {/* Szűrő gombok */}
      <div className="filter-box">
        <h3 className="filter-title">📦 Válassz boltot:</h3>
        <div className="store-selector">
          {stores.map((store) => (
            <button
              key={store.name}
              onClick={() => setSelectedStore(store.name)}
              className={`store-btn ${selectedStore === store.name ? 'active' : ''}`}
            >
              {store.icon} {store.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedStore("")}
            className={`store-btn ${selectedStore === "" ? 'active' : ''}`}
          >
            🔄 Összes bolt
          </button>
        </div>
      </div>

      {/* Kosár tartalom */}
      {cart.length === 0 ? (
        <div className="empty-cart">😞 A kosár üres.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <h3 className="text-xl font-semibold">{item.product}</h3>
              <div className="store-price-grid">
                {stores.map((store) => {
                  const price = getStorePrice(item, store.name);
                  if (selectedStore && store.name !== selectedStore) return null;
                  return (
                    <div key={store.name} className="store-block">
                      <p className="font-semibold">{store.name}</p>
                      {price ? (
                        <p className="price-green">{price} Ft</p>
                      ) : (
                        <p className="price-red">❌ Nincs</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                ❌ Eltávolítás
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Összesítő */}
      <div className="summary-block">
        <h3 className="text-2xl font-semibold mb-4">💰 Összesítő bolt szerint</h3>
        {storeTotals.map((s) => (
          <div key={s.store} className="summary-line">
            <span>{s.store}</span>
            <span className={s.total > 0 ? "summary-total" : "summary-missing"}>
              {s.total > 0 ? `${s.total} Ft` : "Nincs minden termék"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
