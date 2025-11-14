import { IProduct } from "@/shared-types/src/product-types";
import { ProductCard } from "../product-card/product-card";

interface IRelatedProductsProps {
  products: IProduct[];
  category: string;
}

export function RelatedProducts({ products, category }: IRelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          More from {category} category
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Discover similar products you might like
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
