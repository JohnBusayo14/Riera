import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of { productId, name, selectedGauge, quantity }
  totalAmount: 0,
  totalWeight: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, selectedGauge, quantity } = action.payload;
      
      // Create a unique ID for this specific product + gauge combination
      const cartItemId = `${product.id}-${selectedGauge.id}`;
      const existingItem = state.items.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          cartItemId,
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          gauge: selectedGauge,
          price: selectedGauge.price,
          weight: selectedGauge.weight,
          quantity: quantity
        });
      }

      // Recalculate totals
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalWeight = state.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.cartItemId !== action.payload);
      
      // Recalculate totals
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalWeight = state.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalWeight = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;