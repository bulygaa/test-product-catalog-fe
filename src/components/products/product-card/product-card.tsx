import { IProduct } from "@/shared-types/src/product-types";
import { formatPrice } from "@/utils/format-price";
import Image from "next/image";
import Link from "next/link";

interface IProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: IProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <article className="flex cursor-pointer flex-col rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
          <Image
            src={product.images[0] || "/placeholder-product.png"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="mb-1 text-sm font-medium text-neutral-900">
          {product.title}
        </h3>
        <p className="text-sm font-semibold text-neutral-900">
          {formatPrice(product.price, product.currency)}
        </p>
      </article>
    </Link>
  );
}
