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
  const [products, setProducts] = useState([]);

  // Backend kategória kód ➜ frontend kategórianév (megjelenítéshez)
  const categoryMap = {
    kabelek: "Kábelek és vezetékek",
    szerelvenyek: "Szerelvények (kapcsolók, dugaljak)",
    lampatestek: "Lámpatestek",
    eloszto: "Elosztó szekrények és kiegészítők",
    vedelmi: "Védelmi eszközök (kismegszakító, Fi-relé)",
    rogzitesi: "Rögzítési- és kötőanyagok"
  };

  const categories = [
    { name: "Kábelek és vezetékek", icon: kabelek },
    { name: "Szerelvények (kapcsolók, dugaljak)", icon: szerelvenyek },
    { name: "Lámpatestek", icon: lampatestek },
    { name: "Elosztó szekrények és kiegészítők", icon: eloszto },
    { name: "Védelmi eszközök (kismegszakító, Fi-relé)", icon: vedelmi },
    { name: "Rögzítési- és kötőanyagok", icon: kotes }
  ];

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/prices/")
      .then((res) => {
        const transformed = res.data.map((item, index) => ({
          id: index,
          product: item.product.name,
          price: item.price,
          store: item.store.name,
          category: item.product.category ? item.product.category.name : "Ismeretlen kategória",
	  image_url: item.product.image_url,
        }));
        setProducts(transformed);
	console.log("Lekért termékek:", res.data);
	console.log("Átalakított termékek:", transformed);
      })
      .catch((err) => console.error("Hiba az adatok lekérésekor:", err));
  }, []);

  const displayedProducts = filter
  	? products.filter((p) => p.category === filter)
  	: products;

  return (
    <div className="termek-container">
      {/* ✅ Kategóriák */}
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

      {/* ✅ Termékek */}
      {filter && (
        <div className="product-grid">
          {displayedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
  		src={
  			product.image_url ||
  		`https://via.placeholder.com/150x150.png?text=					${encodeURIComponent(product.product)}`
		}
  		alt={product.product}
  		className="product-image"
	      />
              <p className="category-title">{product.product}</p>
              <p className="product-price">{product.price} Ft</p>
              <p className="store">Bolt: {product.store}</p>
              <div className="buttons">
                <button onClick={() => addToCart(product)}>🛒 Kosár</button>
                <button onClick={() => addToFavorites(product)}>❤️ Kedvenc</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 