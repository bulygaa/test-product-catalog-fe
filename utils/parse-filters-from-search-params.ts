import { IProductQueryFilters } from "@/shared-types/src/product-types";
import { ReadonlyURLSearchParams } from "next/navigation";

export const SORT_OPTIONS: {
  value: IProductQueryFilters["sortBy"];
  label: string;
}[] = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

/**
 * Parses product filters from URL search parameters
 * Ensures consistent object shape for RTK Query cache key matching
 */
export function parseFiltersFromSearchParams(
  sp: ReadonlyURLSearchParams | URLSearchParams
): IProductQueryFilters {
  const category = sp.getAll("category");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const sortBy = sp.get("sortBy") as IProductQueryFilters["sortBy"] | null;

  const filters: IProductQueryFilters = {
    search: sp.get("search") || "",
    category: category.length ? category.sort() : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy:
      sortBy && SORT_OPTIONS.some((s) => s.value === sortBy)
        ? sortBy
        : undefined,
    page: 1,
    pageSize: 12,
  };

  Object.keys(filters).forEach((key) => {
    if (filters[key as keyof IProductQueryFilters] === undefined) {
      delete filters[key as keyof IProductQueryFilters];
    }
  });

  return filters;
}
