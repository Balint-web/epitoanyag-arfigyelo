import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./Context";

export default function TermekFigyelo() {
  const { addToCart, addToFavorites } = useCart();
  const [filter, setFilter] = useState("Összes");
  const [products, setProducts] = useState([]);

  // ✅ API hívás backendből
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/prices/")  // Django API endpoint
      .then(response => setProducts(response.data))
      .catch(error => console.error("Hiba az adatok lekérésénél:", error));
  }, []);

  const filteredProducts = filter === "Összes" ? products : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🔎 Termékfigyelő</h2>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
        <label className="font-medium">Válassz kategóriát:</label>
        <select
          className="p-2 rounded-lg border border-gray-300 shadow-sm"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Összes</option>
          <option>Kábelek és vezetékek</option>
          <option>Szerelvények (kapcsolók, dugaljak)</option>
          <option>Lámpatestek</option>
          <option>Elosztó szekrények és kiegészítők</option>
          <option>Védelmi eszközök (kismegszakító, Fi-relé)</option>
          <option>Rögzítési- és kötőanyagok</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">{product.product}</h3>
            <p className="text-gray-700 mb-4">Ár: <span className="font-bold">{product.price} Ft</span></p>
            <p className="text-gray-500">Bolt: {product.store}</p>

            <div className="flex items-center justify-between gap-2 mt-4">
              <button onClick={() => addToCart(product)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                🛒 Kosárba
              </button>
              <button onClick={() => addToFavorites(product)} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                ❤️ Kedvencekhez
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
