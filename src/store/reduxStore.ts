import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from './api/chatApi';
import { serviciosApi } from './api/serviciosApi';

/**
 * Redux Store configurado con RTK Query
 * Incluye el chatApi para gestionar estado del chat
 * Incluye serviciosApi para gestionar servicios de la plataforma
 */
export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [serviciosApi.reducerPath]: serviciosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware, serviciosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
