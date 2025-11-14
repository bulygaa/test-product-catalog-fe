import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IProduct,
  IProductQueryFilters,
  TCreateProductDto,
  TUpdateProductDto,
} from "@/shared-types/src/product-types";
import { IApiResponse, IPaginatedResponse } from "@/shared-types/src/api-types";
import { getBaseUrl } from "@/lib/get-base-url";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${getBaseUrl()}/api` }),

  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    getProducts: builder.query<
      IPaginatedResponse<IProduct>,
      IProductQueryFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.category?.length) {
          filters.category.forEach((c) => params.append("category", c));
        }
        if (filters.minPrice !== undefined)
          params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice !== undefined)
          params.set("maxPrice", String(filters.maxPrice));
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        if (filters.page !== undefined)
          params.set("page", String(filters.page));
        if (filters.pageSize !== undefined)
          params.set("pageSize", String(filters.pageSize));

        const qs = params.toString();
        return `/products${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["ProductList"],
    }),

    createProduct: builder.mutation<IProduct, TCreateProductDto>({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
      }),
      transformResponse: (response: IApiResponse<IProduct>) => response.data!,
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<
      IProduct,
      { slug: string; data: TUpdateProductDto }
    >({
      query: ({ slug, data }) => ({
        url: `/products/${encodeURIComponent(slug)}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: IApiResponse<IProduct>) => response.data!,
      invalidatesTags: (_result, _error, { slug }) => [
        "Product",
        { type: "Product", id: slug },
      ],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/products/${encodeURIComponent(slug)}`,
        method: "DELETE",
      }),
      transformResponse: (response: IApiResponse<null>) => ({
        success: response.success,
        message: response.message ?? "Product deleted successfully",
      }),
      invalidatesTags: (_result, _error, slug) => [
        "Product",
        { type: "Product", id: slug },
        "ProductList",
        { type: "ProductList", id: slug },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
