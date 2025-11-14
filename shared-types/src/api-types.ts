import { IProduct } from "./product-types";

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}

export interface IApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export type TProductsResponse = IPaginatedResponse<IProduct>;

export interface IProductWithRelated extends IProduct {
  relatedProducts: IProduct[];
}
