import React from "react";
import { useCart } from "./Context";

function Kosar() {
  const { cart, removeFromCart } = useCart();

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Kosár</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">A kosár üres.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
                <p className="font-medium">{item.name}</p>
                <p>{item.price} Ft</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  ❌ Eltávolítás
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-200 rounded-lg text-lg font-semibold">
            Összesen: <span className="text-blue-700">{totalPrice} Ft</span>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            💰 Vásárlás indítása (teszt)
          </button>
        </>
      )}
    </div>
  );
}

export default Kosar;
