export type TCategory =
  | "Clothing"
  | "Shoes"
  | "Electronics"
  | "Accessories"
  | "Home & Garden"
  | "Sports"
  | "Books"
  | "Toys";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: TCategory;
  price: string;
  currency: string;
  stockQuantity: number;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export type TCreateProductDto = Omit<
  IProduct,
  "id" | "slug" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type TUpdateProductDto = Partial<TCreateProductDto> & { id: string };

export type TSortBy = "price_asc" | "price_desc" | "newest" | "oldest";
export interface IProductQueryFilters {
  search?: string;
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: TSortBy;
  page?: number;
  pageSize?: number;
}
