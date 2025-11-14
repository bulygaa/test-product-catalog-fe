import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./apis/products-api";

export type TAppStore = ReturnType<typeof makeStore>;
export type TRootState = ReturnType<TAppStore["getState"]>;
export type TAppDispatch = TAppStore["dispatch"];

export const makeStore = (preloadedState?: unknown) => {
  return configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState,
  });
};
