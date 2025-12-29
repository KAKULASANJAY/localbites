import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cartRestaurant');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurant(JSON.parse(savedRestaurant));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
  }, [cartItems, restaurant]);

  const addToCart = (item, restaurantData) => {
    // Check if item is from different restaurant
    if (restaurant && restaurant._id !== restaurantData._id) {
      const confirmed = window.confirm(
        'Your cart contains items from another restaurant. Do you want to clear the cart and add this item?'
      );
      if (!confirmed) return;
      clearCart();
    }

    setRestaurant(restaurantData);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i._id === item._id);
      if (existingItem) {
        toast.success('Quantity updated');
        return prevItems.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      toast.success('Added to cart');
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i._id === itemId);
      if (item && item.quantity > 1) {
        return prevItems.map(i =>
          i._id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prevItems.filter(i => i._id !== itemId);
    });
  };

  const deleteFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(i => i._id !== itemId));
    toast.success('Item removed from cart');
    
    // Clear restaurant if cart is empty
    if (cartItems.length === 1) {
      setRestaurant(null);
    }
  };

  const getItemQuantity = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    restaurant,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getItemQuantity,
    clearCart,
    getCartTotal,
    getItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
