import { IProductQueryFilters } from "@/shared-types/src/product-types";
import { makeStore, TRootState } from "../store";
import { productsApi } from "./products-api";

/**
 * Prefetches products data on the server and returns preloaded Redux state
 * Used for SSR to hydrate the client with initial data
 */
export async function prefetchProducts(
  filters: IProductQueryFilters
): Promise<Partial<TRootState>> {
  const store = makeStore();

  await store.dispatch(productsApi.endpoints.getProducts.initiate(filters));

  await Promise.all(store.dispatch(productsApi.util.getRunningQueriesThunk()));

  return store.getState();
}
