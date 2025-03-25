import React, { useState } from "react";
import { useCart } from "./Context";
import eloszto from './images/elosztoszekreny.png';
import kabelek from './images/kabelek.png';
import szerelvenyek from './images/szerelvenyek.png';
import lampatestek from './images/lampatestek.png';
import vedelmi from './images/vedelmi eszkozok.png';
import kotes from './images/kiegeszitok.png';
import './TermekFigyelo.css'; // ✅ CSS importálva

export default function TermekFigyelo() {
  const { addToCart, addToFavorites } = useCart();
  const [filter, setFilter] = useState("");

  const categories = [
    { name: "Kábelek és vezetékek", icon: kabelek },
    { name: "Szerelvények (kapcsolók, dugaljak)", icon: szerelvenyek },
    { name: "Lámpatestek", icon: lampatestek },
    { name: "Elosztó szekrények és kiegészítők", icon: eloszto },
    { name: "Védelmi eszközök (kismegszakító, Fi-relé)", icon: vedelmi },
    { name: "Rögzítési- és kötőanyagok", icon: kotes }
  ];

  const sampleProducts = [

  // Kábelek és vezetékek
  { id: 1, product: "Réz kábel 3x1.5", price: 500, store: "Daniella", category: "Kábelek és vezetékek" },
  { id: 2, product: "Réz kábel 3x2.5", price: 800, store: "Mentavill", category: "Kábelek és vezetékek" },
  { id: 3, product: "Hálózati kábel CAT6", price: 1200, store: "Mixvill", category: "Kábelek és vezetékek" },
  { id: 4, product: "Földelő kábel 4mm", price: 600, store: "Govill", category: "Kábelek és vezetékek" },
  { id: 5, product: "Vezeték 5x2.5mm", price: 1600, store: "Daniella", category: "Kábelek és vezetékek" },
  { id: 6, product: "Tűzálló kábel 2x1", price: 2200, store: "Mentavill", category: "Kábelek és vezetékek" },

  // Szerelvények
  { id: 7, product: "Fehér dugalj", price: 800, store: "Mentavill", category: "Szerelvények (kapcsolók, dugaljak)" },
  { id: 8, product: "Fekete kapcsoló", price: 1200, store: "Daniella", category: "Szerelvények (kapcsolók, dugaljak)" },
  { id: 9, product: "USB-s fali aljzat", price: 1800, store: "Mixvill", category: "Szerelvények (kapcsolók, dugaljak)" },
  { id: 10, product: "Érintős kapcsoló", price: 3000, store: "Govill", category: "Szerelvények (kapcsolók, dugaljak)" },
  { id: 11, product: "Kétsarkú kapcsoló", price: 1300, store: "Mentavill", category: "Szerelvények (kapcsolók, dugaljak)" },
  { id: 12, product: "Földelt dugalj", price: 950, store: "Daniella", category: "Szerelvények (kapcsolók, dugaljak)" },

  // Lámpatestek
  { id: 13, product: "LED mennyezeti lámpa", price: 2500, store: "Govill", category: "Lámpatestek" },
  { id: 14, product: "Asztali LED lámpa", price: 1800, store: "Mentavill", category: "Lámpatestek" },
  { id: 15, product: "IP44 kültéri lámpa", price: 3500, store: "Mixvill", category: "Lámpatestek" },
  { id: 16, product: "Süllyesztett spot lámpa", price: 900, store: "Daniella", category: "Lámpatestek" },
  { id: 17, product: "Álmennyezeti LED panel", price: 5200, store: "Govill", category: "Lámpatestek" },
  { id: 18, product: "Mozgásérzékelős reflektor", price: 4200, store: "Mentavill", category: "Lámpatestek" },

  // Elosztó szekrények és kiegészítők
  { id: 19, product: "Elosztószekrény 24 modulos", price: 4500, store: "Mixvill", category: "Elosztó szekrények és kiegészítők" },
  { id: 20, product: "Falba süllyeszthető szekrény", price: 6800, store: "Daniella", category: "Elosztó szekrények és kiegészítők" },
  { id: 21, product: "IP65 kültéri szekrény", price: 9500, store: "Govill", category: "Elosztó szekrények és kiegészítők" },
  { id: 22, product: "Fedél modulsínnel", price: 2300, store: "Mentavill", category: "Elosztó szekrények és kiegészítők" },
  { id: 23, product: "Belső elválasztó készlet", price: 1200, store: "Mixvill", category: "Elosztó szekrények és kiegészítők" },
  { id: 24, product: "Lakatos ajtó szekrényhez", price: 3100, store: "Daniella", category: "Elosztó szekrények és kiegészítők" },

  // Védelmi eszközök
  { id: 25, product: "Kismegszakító 16A", price: 1200, store: "Daniella", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },
  { id: 26, product: "Fi-relé 40A", price: 6000, store: "Govill", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },
  { id: 27, product: "Villámvédelmi modul", price: 9500, store: "Mentavill", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },
  { id: 28, product: "Kismegszakító 25A", price: 1300, store: "Mixvill", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },
  { id: 29, product: "Áramvédő relé", price: 7400, store: "Daniella", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },
  { id: 30, product: "Sínre pattintható védőmodul", price: 4800, store: "Govill", category: "Védelmi eszközök (kismegszakító, Fi-relé)" },

  // Rögzítési- és kötőanyagok
  { id: 31, product: "Kábelkötegelő 100db", price: 600, store: "Mentavill", category: "Rögzítési- és kötőanyagok" },
  { id: 32, product: "Fali kábelrögzítő", price: 850, store: "Daniella", category: "Rögzítési- és kötőanyagok" },
  { id: 33, product: "Sínrögzítő klipsz", price: 720, store: "Mixvill", category: "Rögzítési- és kötőanyagok" },
  { id: 34, product: "Dübel 8x40mm 50db", price: 950, store: "Govill", category: "Rögzítési- és kötőanyagok" },
  { id: 35, product: "Csavar M6 50db", price: 1100, store: "Mentavill", category: "Rögzítési- és kötőanyagok" },
  { id: 36, product: "Szerelődoboz fedéllel", price: 1700, store: "Daniella", category: "Rögzítési- és kötőanyagok" },

  ];

  const displayedProducts = filter ? sampleProducts.filter(p => p.category === filter) : [];

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
                src={`https://via.placeholder.com/150x150.png?text=${encodeURIComponent(product.product)}`}
                alt={product.product}
                className="product-image"
              />
              <p className="category-title">{product.product}</p>
              <p className="product-price">{product.price} Ft</p>
              <p className="store">{product.store}</p>
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
