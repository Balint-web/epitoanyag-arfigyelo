import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./Context";

import eloszto from './images/elosztoszekreny.png';
import kabelek from './images/kabelek.png';
import szerelvenyek from './images/szerelvenyek.png';
import lampatestek from './images/lampatestek.png';
import vedelmi from './images/vedelmi eszkozok.png';
import kotes from './images/kiegeszitok.png';

import './TermekFigyelo.css';

export default function TermekFigyelo() {
  const { addToCart, addToFavorites } = useCart();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const categories = [
    { name: "Kábelek és vezetékek", icon: kabelek },
    { name: "Szerelvények (kapcsolók, dugaljak)", icon: szerelvenyek },
    { name: "Lámpatestek", icon: lampatestek },
    { name: "Elosztó szekrények és kiegészítők", icon: eloszto },
    { name: "Védelmi eszközök (kismegszakító, Fi-relé)", icon: vedelmi },
    { name: "Rögzítési- és kötőanyagok", icon: kotes },
  ];

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/grouped-products/")
      .then((res) => {
        const transformed = res.data.map((item, index) => {
		return {
  	 	  id: index,
   	 	  name: item.name,
    	  	  category: item.category,
    	 	  image_url: item.image_url,
    	  	  offers: item.offers,
		};
        });
        setProducts(transformed);
      })
      .catch((err) => console.error("Hiba az adatok lekérésekor:", err));
  }, []);

  // 💡 Szűrés: kategória + keresés
  const displayedProducts = products.filter((p) => {
    const matchesCategory = filter ? p.category === filter : true;
    const matchesSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // 🔍 Automatikus kiegészítés (autocomplete) logika
  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = products
        .map(p => p.name)
        .filter(name => name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5); // csak max 5 találatot mutatunk
      setSuggestions(filtered);
    }
  }, [search, products]);

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setSuggestions([]);
  };

  return (
    <div className="termek-container">

      {/* 🔍 Kereső mező */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Keresés (pl. Fi relé, 40A, kék)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((sug, index) => (
              <li key={index} onClick={() => handleSuggestionClick(sug)}>
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📦 Kategóriák */}
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => setFilter(cat.name)}
            className={`category-card ${filter === cat.name ? "active" : ""}`}
          >
            <img src={cat.icon} alt={cat.name} className="category-image" />
            <p className="category-title">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 🛒 Termékek megjelenítése */}
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={
                product.image_url ||
                `https://via.placeholder.com/150x150.png?text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              className="product-image"
            />
            <p className="category-title">{product.name}</p>
            <p className="product-price">
              {Math.min(...product.offers.map(o => o.price))} Ft-tól
            </p>
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
