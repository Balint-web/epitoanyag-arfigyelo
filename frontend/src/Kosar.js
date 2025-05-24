import React, { useEffect, useState } from "react";
import { useCart } from "./Context";
import "./Kosar.css";

const stores = [
  { name: "Daniella"},
  { name: "Mentavill"},
  { name: "Govill"},
  { name: "Mixvill"},
];

export default function Kosar() {
  const { cart, removeFromCart, addToFavorites } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (cart.length === 0) return;

    const url = `http://localhost:8000/api/grouped-products/`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) =>
          cart.some((c) => c.name === item.name)
        );
        setProducts(filtered);

        const initialQuantities = { ...quantities };
        filtered.forEach((item) => {
          if (!initialQuantities[item.name]) {
            initialQuantities[item.name] = 1;
          }
        });
        setQuantities(initialQuantities);
      });
  }, [cart]);

  const getBestStore = (offers) => {
    return offers.reduce((best, curr) => {
      if (!best || curr.price < best.price) {
        return curr;
      }
      return best;
    }, null);
  };

  const isMixedStores = () => {
    const bestStores = products.map((p) => {
      const best = getBestStore(p.offers);
      return best ? best.store : null;
    });
    const uniqueStores = new Set(bestStores.filter(Boolean));
    return uniqueStores.size > 1;
  };

  const calculateTotal = () => {
    let total = 0;
    let complete = true;

    products.forEach((p) => {
      const offer = selectedStore
        ? p.offers.find((o) => o.store === selectedStore)
        : getBestStore(p.offers);

      if (offer) {
        total += offer.price * (quantities[p.name] || 1);
      } else {
        complete = false;
      }
    });

    return { total, complete };
  };

  const handleQuantityChange = (name, value) => {
    const val = parseInt(value);
    if (val > 0) {
      setQuantities({ ...quantities, [name]: val });
    }
  };

  const removeProduct = (name) => {
    removeFromCart(name);
    setProducts(products.filter((p) => p.name !== name));
    const newQuantities = { ...quantities };
    delete newQuantities[name];
    setQuantities(newQuantities);
  };

  const handleDeleteClick = (name) => {
    const currentQty = quantities[name] || 1;
    if (currentQty > 1) {
      setQuantities({ ...quantities, [name]: currentQty - 1 });
    } else {
      removeProduct(name);
    }
  };

  const toggleFavorite = (product) => {
    addToFavorites(product);
  };

  const { total, complete } = calculateTotal();

  return (
    <div className="kosar-container">
      <h2 className="kosar-title">🛒 Kosár - Ár összehasonlítás</h2>

      <div className="best-offers-box">
        <h3 className="best-offers-title">📌 Legjobb ár</h3>
        <div className="best-offers-table">
          <div className="best-offers-header">
            <span>Termék neve</span>
            <span>Bolt</span>
            <span>Egység ár</span>
          </div>
          {products.map((product) => {
            const best = getBestStore(product.offers);
            return (
              <div key={product.name} className="best-offers-row">
                <span className="cell-name">{product.name}</span>
                <span className="cell-store">{best ? best.store : "-"}</span>
                <span className="cell-price">{best ? best.price.toLocaleString() + " Ft" : "-"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="filter-box">
        <h3 className="filter-title">📦 Válassz boltot:</h3>
        <div className="store-selector-horizontal">
          {stores.map((store) => (
            <button
              key={store.name}
              onClick={() => setSelectedStore(store.name)}
              className={`store-btn ${selectedStore === store.name ? "active" : ""}`}
            >
              {store.icon} {store.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedStore("")}
            className={`store-btn ${selectedStore === "" ? "active" : ""}`}
          >
            Legalacsonyabb ár
          </button>
        </div>
      </div>

      <div className="best-offers-box">
        <div className="best-offers-header">
          <span>Termék neve</span>
          <span>Bolt</span>
          <span>Ár (Ft)</span>
          <span>Műveletek</span>
        </div>
        {products.map((product) => {
          const offer = selectedStore
            ? product.offers.find((o) => o.store === selectedStore)
            : getBestStore(product.offers);

          return (
            <div key={product.name} className="best-offers-row">
              <span className="cell-name action-row">
                {product.name}
                <div className="action-group">
                  <input
                    type="number"
                    value={quantities[product.name] || 1}
                    onChange={(e) => handleQuantityChange(product.name, e.target.value)}
                    min="1"
                  />
                  <button className="delete-btn" onClick={() => handleDeleteClick(product.name)}>🗑️</button>
                  <button className="fav-btn" onClick={() => toggleFavorite(product)}>❤️</button>
                </div>
              </span>
              <span className="cell-store">
                {offer ? (
                  <>{offer.store}</>
                ) : (
                  <span className="price-red">Nem érhető el</span>
                )}
              </span>
              <span className="cell-price">
                {offer ? offer.price.toLocaleString() + " Ft" : "-"}
              </span>
            </div>
          );
        })}

        <div className="summary-block">
          <h3>💰 Összesen: {total.toLocaleString()} Ft</h3>
          {!complete && (
            <p className="warning">⚠️ Néhány termék nem elérhető a kiválasztott boltban!</p>
          )}
          {!selectedStore && isMixedStores() && (
            <p className="warning-mixed">
          A legjobb árak több bolt kombinációjából származnak, nem egyetlen bolt kínálatából!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}