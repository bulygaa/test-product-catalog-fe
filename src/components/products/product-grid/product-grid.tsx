"use client";

import { IProduct } from "@/shared-types/src/product-types";
import { useState } from "react";
import { ProductCard } from "../product-card/product-card";
import { AddProductModal } from "../modals/add-product-modal";

interface IProductGridProps {
  items: IProduct[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function ProductGrid({
  items,
  isLoading,
  error,
  onRefresh,
}: IProductGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    onRefresh?.();
  };

  return (
    <div id="ProductGridProps" className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Products
          </h2>
          <p className="text-xs text-neutral-500">
            Browse and manage your catalog.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
        >
          <span className="flex h-5 w-5 items-center justify-center text-sm">
            +
          </span>
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading && !items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="space-y-2 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm"
            >
              <div className="h-32 w-full rounded-xl bg-neutral-100" />
              <div className="h-4 w-2/3 rounded bg-neutral-100" />
              <div className="h-4 w-1/3 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {!items.length && !isLoading && (
            <div className="col-span-full rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
              No products match the current filters.
            </div>
          )}
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
