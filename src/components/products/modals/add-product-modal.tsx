"use client";

import { useCreateProductMutation } from "@/lib/store/apis/products-api";
import { TCategory } from "@/shared-types/src/product-types";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { createProductSchema } from "@/shared-types/src/fe-zod-schemas";

interface IAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES: TCategory[] = [
  "Clothing",
  "Shoes",
  "Electronics",
  "Accessories",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
];

type TProductFormValues = Omit<
  z.infer<typeof createProductSchema>,
  "images"
> & {
  images: string;
};

const formValidationSchema = createProductSchema.extend({
  images: z
    .string()
    .min(1, "At least one image URL is required")
    .refine(
      (val) => {
        const urls = val
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean);
        return (
          urls.length > 0 &&
          urls.every((url) => {
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          })
        );
      },
      { message: "Please provide valid image URLs separated by commas" }
    ),
});

export function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: IAddProductModalProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const formik = useFormik<TProductFormValues>({
    initialValues: {
      title: "",
      description: "",
      images: "",
      category: "" as TCategory,
      price: "",
      currency: "USD",
      stockQuantity: 0,
    },
    validationSchema: toFormikValidationSchema(formValidationSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        // Transform images string to array
        const images = values.images
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean);

        const productData = {
          ...values,
          images,
        };

        // Final validation with original schema
        const validatedData = createProductSchema.parse(productData);

        await createProduct(validatedData).unwrap();
        formik.resetForm();
        onClose();
        onSuccess?.();
      } catch (err) {
        if (err instanceof z.ZodError) {
          formik.setErrors({
            images: err.issues.find((e) => e.path.includes("images"))?.message,
          });
        } else {
          formik.setStatus({
            error:
              err instanceof Error ? err.message : "Failed to create product",
          });
        }
      }
    },
  });

  const handleClose = () => {
    if (!isCreating) {
      formik.resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-neutral-900"
          >
            Add New Product
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className="rounded-lg p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6">
          {formik.status?.error && (
            <div className="text-xs rounded-lg bg-red-50 text-red-700">
              {formik.status.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Product Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                disabled={isCreating}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border text-black border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500 text-black"
                placeholder="Enter product title"
                aria-invalid={formik.touched.title && !!formik.errors.title}
                aria-describedby={
                  formik.touched.title && formik.errors.title
                    ? "title-error"
                    : undefined
                }
              />
              {formik.touched.title && formik.errors.title && (
                <p id="title-error" className="mt-1.5 text-xs text-red-600">
                  {formik.errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                disabled={isCreating}
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full text-black rounded-lg border border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                placeholder="Enter product description"
                aria-invalid={
                  formik.touched.description && !!formik.errors.description
                }
                aria-describedby={
                  formik.touched.description && formik.errors.description
                    ? "description-error"
                    : undefined
                }
              />
              {formik.touched.description && formik.errors.description && (
                <p
                  id="description-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                disabled={isCreating}
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border text-black border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                aria-invalid={
                  formik.touched.category && !!formik.errors.category
                }
                aria-describedby={
                  formik.touched.category && formik.errors.category
                    ? "category-error"
                    : undefined
                }
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <p id="category-error" className="mt-1.5 text-xs text-red-600">
                  {formik.errors.category}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  disabled={isCreating}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full text-black rounded-lg border border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                  placeholder="99.99"
                  aria-invalid={formik.touched.price && !!formik.errors.price}
                  aria-describedby={
                    formik.touched.price && formik.errors.price
                      ? "price-error"
                      : undefined
                  }
                />
                {formik.touched.price && formik.errors.price && (
                  <p id="price-error" className="mt-1.5 text-xs text-red-600">
                    {formik.errors.price}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="currency"
                  className="mb-1.5 block text-sm font-medium text-neutral-700"
                >
                  Currency
                </label>
                <input
                  id="currency"
                  name="currency"
                  type="text"
                  disabled={isCreating}
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border text-black border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                  placeholder="USD"
                  maxLength={3}
                  aria-invalid={
                    formik.touched.currency && !!formik.errors.currency
                  }
                  aria-describedby={
                    formik.touched.currency && formik.errors.currency
                      ? "currency-error"
                      : undefined
                  }
                />
                {formik.touched.currency && formik.errors.currency && (
                  <p
                    id="currency-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {formik.errors.currency}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="stockQuantity"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Stock Quantity
              </label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                disabled={isCreating}
                value={formik.values.stockQuantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border text-black border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                aria-invalid={
                  formik.touched.stockQuantity && !!formik.errors.stockQuantity
                }
                aria-describedby={
                  formik.touched.stockQuantity && formik.errors.stockQuantity
                    ? "stockQuantity-error"
                    : undefined
                }
              />
              {formik.touched.stockQuantity && formik.errors.stockQuantity && (
                <p
                  id="stockQuantity-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {formik.errors.stockQuantity}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="images"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                Image URLs
              </label>
              <input
                id="images"
                name="images"
                type="text"
                disabled={isCreating}
                value={formik.values.images}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border text-black border-neutral-200 px-3 py-2 text-sm transition focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-50 disabled:text-neutral-500"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                aria-invalid={formik.touched.images && !!formik.errors.images}
                aria-describedby={
                  formik.touched.images && formik.errors.images
                    ? "images-error"
                    : "images-help"
                }
              />
              {formik.touched.images && formik.errors.images ? (
                <p id="images-error" className="mt-1.5 text-xs text-red-600">
                  {formik.errors.images}
                </p>
              ) : (
                <p id="images-help" className="mt-1.5 text-xs text-neutral-500">
                  Separate multiple URLs with commas
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !formik.isValid}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
