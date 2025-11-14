import { IProductWithRelated } from "@/shared-types/src/api-types";
import Image from "next/image";
import { RelatedProducts } from "../related-products/related-products";

interface IProductDetailsProps {
  product: IProductWithRelated;
}

export function ProductDetails({ product }: IProductDetailsProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <article className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-white">
            {product.images?.[0] ? (
              <Image
                width={100}
                height={200}
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {product.title}
              </h1>
              {product.category && (
                <p className="mt-2 text-sm text-gray-500">{product.category}</p>
              )}
            </div>

            {product.price && (
              <div className="text-2xl font-semibold text-gray-900">
                ${(+product.price).toFixed(2)}
              </div>
            )}

            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {product.stockQuantity !== undefined && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    product.stockQuantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>

      <RelatedProducts
        products={product.relatedProducts}
        category={product.category}
      />
    </div>
  );
}
