import React from "react";
import { useCart } from "./Context";

function Kedvencek() {
  const { favorites, removeFromFavorites } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">❤️ Kedvencek</h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">Nincsenek kedvenc termékek.</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
              <div>
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-gray-600">{item.price} Ft</p>
              </div>
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                ❌ Eltávolítás
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Kedvencek;
