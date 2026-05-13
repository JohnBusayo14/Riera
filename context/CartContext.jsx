import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /**
   * Helper to format a product into a cart item
   */
  const formatItem = (product, selectedGauge, quantity) => {
    return {
      cartId: `${product.id}-${selectedGauge?.id || 'default'}`,
      id: product.id,
      name: product.label || product.name || "Product",
      price: selectedGauge ? selectedGauge.price : product.price,
      quantity: quantity,
      // COORDINATES FOR HAVERSINE (from backend)
      sellerId: product.sellerId || product.SellerId,
      sellerLat: product.sellerLat || product.lat,
      sellerLng: product.sellerLng || product.lng,
      sellerName: product.sellerName || "this store"
    };
  };

  /**
   * Add to Cart with Single-Seller Enforcement
   */
  const addToCart = (product, selectedGauge, quantity) => {
    const newSellerId = product.sellerId || product.SellerId;

    // 1. CHECK FOR CONFLICT: Different Seller detected
    if (cart.length > 0 && cart[0].sellerId !== newSellerId) {
      Alert.alert(
        "Start New Order?",
        `Your cart contains items from another store. You can only checkout from one store at a time. Clear cart and add this instead?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Clear & Add", 
            onPress: () => {
              const newItem = formatItem(product, selectedGauge, quantity);
              setCart([newItem]);
            }
          }
        ]
      );
      return;
    }

    // 2. ADD/UPDATE: Seller matches or cart is empty
    const newItem = formatItem(product, selectedGauge, quantity);
    
    setCart(prev => {
      const exists = prev.find(item => item.cartId === newItem.cartId);
      if (exists) {
        return prev.map(item => item.cartId === newItem.cartId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, newItem];
    });
  };

  const updateQty = (identifier, newQty) => {
    setCart(prev => prev.map(item => 
      (item.cartId === identifier || item.id === identifier) 
      ? { ...item, quantity: newQty } 
      : item
    ));
  };

  const removeFromCart = (identifier) => {
    setCart(prev => prev.filter(item => 
      item.cartId !== identifier && item.id !== identifier
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      setCart, 
      addToCart, 
      updateQty, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);