import type { IProductQueryFilters } from "@/shared-types/src/product-types";

/**
 * Normalizes product query filters for consistent cache key generation
 * Removes undefined values and ensures consistent property ordering
 */
export function serializeFilters(
  filters: IProductQueryFilters
): IProductQueryFilters {
  const normalized: IProductQueryFilters = {};

  // Only include defined values in consistent order
  if (filters.search !== undefined) normalized.search = filters.search;
  if (filters.category !== undefined && filters.category.length > 0) {
    normalized.category = [...filters.category].sort(); // Sort for consistency
  }
  if (filters.minPrice !== undefined) normalized.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) normalized.maxPrice = filters.maxPrice;
  if (filters.sortBy !== undefined) normalized.sortBy = filters.sortBy;
  if (filters.page !== undefined) normalized.page = filters.page;
  if (filters.pageSize !== undefined) normalized.pageSize = filters.pageSize;

  return normalized;
}
