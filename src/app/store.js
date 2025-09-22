import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import cartSlice from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
