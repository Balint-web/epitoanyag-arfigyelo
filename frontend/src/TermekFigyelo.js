import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./Context";
import './TermekFigyelo.css';
import kabel from './images/kabelek.png';
import szerelveny from './images/szerelvenyek.png';
import lampa from './images/lampatestek.png';
import eloszto from './images/elosztoszekreny.png';
import vedelem from './images/vedelmi eszkozok.png';
import kiegeszito from './images/kiegeszitok.png';

export default function TermekFigyelo() {
  const { addToCart, addToFavorites } = useCart();
  const [filter, setFilter] = useState(""); // Nem "Összes", hanem üres string
  const [products, setProducts] = useState([]);

  const categories = [
    { name: "Kábelek és vezetékek", image: kabel },
    { name: "Szerelvények (kapcsolók, dugaljak)", image: szerelveny },
    { name: "Lámpatestek", image: lampa },
    { name: "Elosztó szekrények és kiegészítők", image: eloszto },
    { name: "Védelmi eszközök (kismegszakító, Fi-relé)", image: vedelem },
    { name: "Rögzítési- és kötőanyagok", image: kiegeszito }
  ];

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/prices/")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Hiba az adatok lekérésénél:", error));
  }, []);

  // Ha nincs filter, akkor ne szűrj
  const filteredProducts = filter === "" ? products : products.filter(p => p.category === filter);

  return (
    <div className="termek-container">
      <h2 className="title">🔎 Termék figyelő</h2>

      {/* ✅ Kategóriák képpel */}
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`category-card ${filter === cat.name ? 'active' : ''}`}
            onClick={() => setFilter(cat.name)}
          >
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* ✅ Termékek kártyákban */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={`https://via.placeholder.com/400x250.png?text=${encodeURIComponent(product.product)}`} alt={product.product} />
            <h3>{product.product}</h3>
            <p>Ár: <strong>{product.price} Ft</strong></p>
            <p>Bolt: {product.store}</p>
            <div className="buttons">
              <button onClick={() => addToCart(product)}>🛒 Kosár</button>
              <button onClick={() => addToFavorites(product)}>❤️ Kedvenc</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
