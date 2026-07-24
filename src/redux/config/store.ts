import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice, { setCredentials } from '../state/auth/auth-state';
import Api from './api';

const resetApiCacheOnLogin: Middleware = storeApi => next => action => {
  const result = next(action);

  if (setCredentials.match(action)) {
    storeApi.dispatch(Api.util.resetApiState());
  }

  return result;
};

export const store = configureStore({
  reducer: {
    [Api.reducerPath]: Api.reducer,
    authSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(Api.middleware, resetApiCacheOnLogin),
  // devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
