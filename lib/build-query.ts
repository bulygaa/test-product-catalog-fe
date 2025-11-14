import { IProductQueryFilters } from "@/shared-types/src/product-types";

/**
 * Builds query string for GET /products from your IProductQueryFilters.
 * Sends only defined values. Handles category[].
 */
export function buildProductQuery(filters: IProductQueryFilters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category?.length) {
    // multiple categories supported by backend as repeated query params
    for (const c of filters.category) params.append("category", c);
  }
  if (typeof filters.minPrice === "number")
    params.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number")
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (typeof filters.page === "number")
    params.set("page", String(filters.page));
  if (typeof filters.pageSize === "number")
    params.set("pageSize", String(filters.pageSize));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
