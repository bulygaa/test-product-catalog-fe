"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api-fetch";
import { buildProductQuery } from "@/lib/build-query";
import {
  IPaginatedResponse,
  IApiResponse,
  IProductWithRelated,
} from "@/shared-types/src/api-types";
import {
  IProductQueryFilters,
  IProduct,
  TCreateProductDto,
  TUpdateProductDto,
} from "@/shared-types/src/product-types";

/**
 * GET /products
 */
export async function getProductsAction(filters: IProductQueryFilters = {}) {
  const qs = buildProductQuery(filters);
  const res = await apiFetch<IPaginatedResponse<IProduct>>(`/products${qs}`);

  return res;
}

/**
 * GET /products/:slug
 */
export async function getProductBySlugAction(slug: string) {
  const res = await apiFetch<IApiResponse<IProduct>>(
    `/products/${encodeURIComponent(slug)}`
  );
  return res.data!;
}

/**
 * GET /products/:slug/related
 * Your backend route returns the "product + relatedProducts" object.
 */
export async function getProductWithRelatedAction(slug: string) {
  const res = await apiFetch<IApiResponse<IProductWithRelated>>(
    `/products/${encodeURIComponent(slug)}/related`
  );
  return res.data!;
}

/**
 * POST /products
 */
export async function createProductAction(input: TCreateProductDto) {
  console.log("🚀 ~ createProductAction ~ input:", input);
  const res = await apiFetch<IApiResponse<IProduct>>(`/products`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  // Optional cache busts
  revalidatePath("/products");
  if (res.data?.slug) revalidatePath(`/products/${res.data.slug}`);

  return res.data!;
}

/**
 * PUT /products/:slug
 * Backend uses :slug in the route. `id` in body is supported by your schema; keep it if you need it.
 */
export async function updateProductAction(
  slug: string,
  input: TUpdateProductDto
) {
  const res = await apiFetch<IApiResponse<IProduct>>(
    `/products/${encodeURIComponent(slug)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );

  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);

  return res.data!;
}

/**
 * DELETE /products/:slug
 */
export async function deleteProductAction(slug: string) {
  const res = await apiFetch<IApiResponse<null>>(
    `/products/${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
    }
  );

  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);

  return { success: res.success, message: res.message ?? "Deleted" };
}
