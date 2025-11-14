import { z } from "zod";

const categoryEnum = z.enum([
  "Clothing",
  "Shoes",
  "Electronics",
  "Accessories",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
]);

export const createProductSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  category: categoryEnum,
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3).default("USD"),
  stockQuantity: z.number().int().min(0).default(0),
});

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    id: z.string(),
  })
  .required({ id: true });

export const queryFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.array(z.string()).optional(), // Array of categories
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "oldest"])
    .optional()
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20), // Changed to pageSize
});
