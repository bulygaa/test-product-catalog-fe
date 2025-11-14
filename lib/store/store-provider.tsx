"use client";

import { Provider } from "react-redux";
import { useState } from "react";
import { makeStore, TRootState } from "./store";

interface IStoreProviderProps {
  children: React.ReactNode;
  preloadedState?: Partial<TRootState>;
}

export function StoreProvider({
  children,
  preloadedState,
}: IStoreProviderProps) {
  // Lazy initialization ensures makeStore is only called once
  const [store] = useState(() => makeStore(preloadedState));

  return <Provider store={store}>{children}</Provider>;
}
