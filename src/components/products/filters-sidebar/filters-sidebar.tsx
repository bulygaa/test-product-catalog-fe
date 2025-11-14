"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { IProductQueryFilters } from "@/shared-types/src/product-types";
import { SORT_OPTIONS } from "@/utils/parse-filters-from-search-params";
import { usePathname, useRouter } from "next/navigation";
import { SearchBar } from "./search-bar";

interface FiltersSidebarProps {
  filters: IProductQueryFilters;
  onCategoryToggle: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
  onSortChange: (value: IProductQueryFilters["sortBy"]) => void;
}

export const CATEGORY_OPTIONS: { label: string; value: string }[] = [
  { label: "Clothing", value: "Clothing" },
  { label: "Shoes", value: "Shoes" },
  { label: "Accessories", value: "Accessories" },
  { label: "Electronics", value: "Electronics" },
];

export const MAX_PRICE_DEFAULT = 1000;
const PRICE_DEBOUNCE_MS = 400;

export function FiltersSidebar({
  filters,
  onCategoryToggle,
  onMaxPriceChange,
  onSortChange,
}: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategories = filters.category ?? [];
  const sortBy = filters.sortBy ?? undefined;

  const [localMaxPrice, setLocalMaxPrice] = useState(
    filters.maxPrice ?? MAX_PRICE_DEFAULT
  );

  const onSetLocalMaxPrice = useEffectEvent(() => {
    setLocalMaxPrice(filters.maxPrice ?? MAX_PRICE_DEFAULT);
  });

  const isFiltersActive =
    selectedCategories.length > 0 ||
    (filters.maxPrice && filters.maxPrice < MAX_PRICE_DEFAULT) ||
    !!sortBy ||
    !!filters.search;

  const handleClearAll = () => {
    router.push(pathname);
  };

  useEffect(() => {
    onSetLocalMaxPrice();
  }, [filters.maxPrice]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localMaxPrice !== filters.maxPrice) {
        onMaxPriceChange(localMaxPrice);
      }
    }, PRICE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [localMaxPrice, filters.maxPrice, onMaxPriceChange]);

  return (
    <div className="flex flex-col gap-8 text-sm text-neutral-900">
      {isFiltersActive && (
        <button
          onClick={handleClearAll}
          className="rounded-lg cursor-pointer border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          Clear All Filters
        </button>
      )}

      <section>
        <div className="my-2">
          <SearchBar placeholder="Search" />
        </div>
        <h3 className="mb-3 text-sm font-semibold tracking-tight">Category</h3>
        <div className="space-y-2 text-sm">
          {CATEGORY_OPTIONS.map((cat) => (
            <label
              key={cat.value}
              className="flex cursor-pointer items-center gap-2 text-neutral-700"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-black"
                checked={selectedCategories.includes(cat.value)}
                onChange={() => onCategoryToggle(cat.value)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-tight">
          Price Range
        </h3>
        <div className="mb-2 flex justify-between text-xs text-neutral-500">
          <span>0</span>
          <span>max</span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_DEFAULT}
          step={10}
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="mt-1 text-xs text-neutral-600">
          Up to ${localMaxPrice}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold tracking-tight">Sort by</h3>
        <div className="relative">
          <select
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            value={sortBy ?? ""}
            onChange={(e) =>
              onSortChange(
                (e.target.value || null) as IProductQueryFilters["sortBy"]
              )
            }
          >
            <option value="">Sort by Price</option>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value ?? ""}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
