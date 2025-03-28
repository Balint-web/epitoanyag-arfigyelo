import React, { createContext, useState, useContext } from 'react';

// Alap kontextus
const AppContext = createContext();

// Provider komponens
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null); // ✅ Bejelentkezett user

  // Kosárhoz
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Kedvencekhez
  const addToFavorites = (product) => {
    setFavorites([...favorites, product]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter((item) => item.id !== productId));
  };

  // ✅ Auth funkciók
  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
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

// Kosárhoz, kedvencekhez
export const useCart = () => useContext(AppContext);

// ✅ Bejelentkezéshez
export const useAuth = () => {
  const { user, loginUser, logoutUser } = useContext(AppContext);
  return { user, loginUser, logoutUser };
};
