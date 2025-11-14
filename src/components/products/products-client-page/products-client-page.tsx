"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { IProductQueryFilters } from "@/shared-types/src/product-types";
import { parseFiltersFromSearchParams } from "@/utils/parse-filters-from-search-params";
import { ProductGrid } from "../product-grid/product-grid";
import {
  FiltersSidebar,
  MAX_PRICE_DEFAULT,
} from "../filters-sidebar/filters-sidebar";
import { setUrlParam } from "@/utils/set-url-param";
import { setUrlArrayParam } from "@/utils/set-url-array-param";
import { useGetProductsQuery } from "@/lib/store/apis/products-api";

export function ProductsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters = useMemo(() => {
    return parseFiltersFromSearchParams(searchParams);
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useGetProductsQuery(filters, {
    skip: false,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const updateFiltersInUrl = (patch: Partial<IProductQueryFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (patch.category !== undefined) {
      setUrlArrayParam(params, "category", patch.category);
    }

    if (patch.minPrice !== undefined) {
      setUrlParam(params, "minPrice", patch.minPrice);
    }

    if (patch.maxPrice !== undefined) {
      setUrlParam(params, "maxPrice", patch.maxPrice);
    }

    if (patch.sortBy !== undefined) {
      setUrlParam(params, "sortBy", patch.sortBy);
    }

    params.delete("page");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, {
      scroll: false,
    });
  };

  const handleCategoryToggle = (value: string) => {
    const current = filters.category ?? [];
    const isExists = current.includes(value);
    const next = isExists
      ? current.filter((c) => c !== value)
      : [...current, value];

    updateFiltersInUrl({ category: next });
  };

  const handleMaxPriceChange = (value: number) => {
    updateFiltersInUrl({
      maxPrice: value === MAX_PRICE_DEFAULT ? undefined : value,
    });
  };

  const handleSortChange = (value: IProductQueryFilters["sortBy"]) => {
    updateFiltersInUrl({ sortBy: value || undefined });
  };

  const items = data?.data?.items ?? [];
  const errorMessage = error ? "Failed to load products" : null;

  return (
    <div className="min-h-screen bg-neutral-100 py-10">
      <div className="mx-auto flex max-w-6xl gap-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="w-64 shrink-0 border-r border-neutral-100 pr-6 md:pr-8">
          <FiltersSidebar
            filters={filters}
            onCategoryToggle={handleCategoryToggle}
            onMaxPriceChange={handleMaxPriceChange}
            onSortChange={handleSortChange}
          />
        </div>

        <div className="flex-1">
          <ProductGrid
            items={items}
            isLoading={isLoading && !items.length}
            error={errorMessage}
            onRefresh={() => refetch()}
          />
        </div>
      </div>
    </div>
  );
}
