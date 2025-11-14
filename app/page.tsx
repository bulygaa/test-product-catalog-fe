import { prefetchProducts } from "@/lib/store/apis/prefetch-products";
import { StoreProvider } from "@/lib/store/store-provider";
import {
  IProductQueryFilters,
  TSortBy,
} from "@/shared-types/src/product-types";
import { ProductsClient } from "@/src/components/products/products-client-page/products-client-page";

interface IProductsPageProps {
  searchParams: {
    search?: string;
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
    pageSize?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: IProductsPageProps) {
  const params = await searchParams;

  const filters: IProductQueryFilters = {
    search: params.search || undefined,
    category: Array.isArray(params.category)
      ? params.category
      : params.category
      ? [params.category]
      : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy: (params.sortBy || "price_asc") as TSortBy,
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 10,
  };

  const preloadedState = await prefetchProducts(filters);

  return (
    <StoreProvider preloadedState={preloadedState}>
      <ProductsClient />
    </StoreProvider>
  );
}
