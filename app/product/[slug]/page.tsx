import { notFound } from "next/navigation";
import { IApiError } from "@/shared-types/src/api-types";
import { getProductWithRelatedAction } from "@/app/actions/products";
import { ProductDetails } from "@/src/components/products/product-details/product-details";

interface IProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: IProductPageProps) {
  const { slug } = await params;

  let product;

  try {
    product = await getProductWithRelatedAction(slug);
  } catch (error) {
    const apiError = error as IApiError;

    if (apiError.statusCode === 404) {
      notFound();
    }

    throw error;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
