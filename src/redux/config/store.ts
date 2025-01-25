import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import Api from './api';

export const store = configureStore({
  reducer: {
    [Api.reducerPath]: Api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(Api.middleware),
  // devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
