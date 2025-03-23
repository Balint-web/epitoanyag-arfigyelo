import React, { createContext, useState, useContext } from 'react';

// Kosár kontextus létrehozása
const Context = createContext();

// Kosár provider komponens
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Termék hozzáadása a kosárhoz
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Termék eltávolítása a kosárból
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Termék hozzáadása a kedvencekhez
  const addToFavorites = (product) => {
    setFavorites([...favorites, product]);
  };

  // Termék eltávolítása a kedvencekből
  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter((item) => item.id !== productId));
  };

  return (
    <Context.Provider value={{ cart, addToCart, removeFromCart, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </Context.Provider>
  );
};

// Hook a kontextus használatához
export const useCart = () => {
  return useContext(Context);
};
