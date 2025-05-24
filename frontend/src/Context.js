import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔐 Felhasználó állapot: localStorage-ből töltjük be elsőre
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Kosár műveletek
  const addToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter((item) => item.name !== productName));
  };

  // Kedvencek
  const addToFavorites = (product) => {
    if (!favorites.find((item) => item.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter((item) => item.id !== productId));
  };

  // ✅ Bejelentkezés: mentés localStorage-be
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Kijelentkezés: törlés
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ha ezt is tárolod
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        favorites,
        addToFavorites,
        removeFromFavorites,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useCart = () => useContext(AppContext);

export const useAuth = () => {
  const { user, loginUser, logoutUser } = useContext(AppContext);
  return { user, loginUser, logoutUser };
};
