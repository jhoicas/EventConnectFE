import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from './api/chatApi';

/**
 * Redux Store configurado con RTK Query
 * Incluye el chatApi para gestionar estado del chat
 */
export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
