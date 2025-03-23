import React, { useState } from "react";
import { useCart } from "./Context";

export default function TermekFigyelo() {
  const { addToCart, addToFavorites } = useCart();
  const [filter, setFilter] = useState("Összes");

  const products = [
    { id: 1, name: "Kábel 3x1.5", category: "Kábelek és vezetékek", price: 3500, image: "/images/kabel.jpg", availableShops: ["Daniella", "Mentavill"] },
    { id: 2, name: "Dugalj fehér", category: "Szerelvények (kapcsolók, dugaljak)", price: 1200, image: "/images/dugalj.jpg", availableShops: ["Govill", "Mixvill"] },
    { id: 3, name: "LED lámpatest", category: "Lámpatestek", price: 8000, image: "/images/lampa.jpg", availableShops: ["Daniella", "Govill", "Mixvill"] },
    { id: 4, name: "Elosztó szekrény 24 modulos", category: "Elosztó szekrények és kiegészítők", price: 15000, image: "/images/szekreny.jpg", availableShops: ["Mentavill", "Mixvill"] },
    { id: 5, name: "Kismegszakító 16A", category: "Védelmi eszközök (kismegszakító, Fi-relé)", price: 3000, image: "/images/kismegszakito.jpg", availableShops: ["Daniella", "Govill"] },
    { id: 6, name: "Tipli + csavar szett", category: "Rögzítési- és kötőanyagok", price: 2000, image: "/images/tipli.jpg", availableShops: ["Govill", "Mentavill", "Mixvill"] },
  ];

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
            <img src={product.image} alt={product.name} className="rounded-xl w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-4">Ár: <span className="font-bold">{product.price} Ft</span></p>

            {/* 🔎 Elérhető boltok megjelenítése */}
            <div className="mt-4">
              <p className="text-sm font-semibold">Elérhető boltok:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Daniella", "Mentavill", "Govill", "Mixvill"].map((shop) => (
                  <span
                    key={shop}
                    className={`text-xs px-2 py-1 rounded ${
                      product.availableShops.includes(shop) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {shop}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4">
              <button onClick={() => addToCart(product)} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                🛒 Kosárba
              </button>
              <button onClick={() => addToFavorites(product)} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                ❤️ Kedvencekhez
              </button>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5" /> Összehasonlít
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
