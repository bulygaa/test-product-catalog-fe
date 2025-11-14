import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";
import { buildProductQuery } from "@/lib/build-query";
import {
  IProduct,
  IProductQueryFilters,
  TSortBy,
} from "@/shared-types/src/product-types";
import { IApiResponse, IPaginatedResponse } from "@/shared-types/src/api-types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const categories = searchParams.getAll("category");

    const filters: IProductQueryFilters = {
      search: searchParams.get("search") || undefined,
      category: categories.length > 0 ? categories : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      sortBy: (searchParams.get("sortBy") as TSortBy) || undefined,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : undefined,
    };

    const qs = buildProductQuery(filters);
    const response = await apiFetch<IPaginatedResponse<IProduct>>(
      `/products${qs}`
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await apiFetch<IApiResponse<IProduct>>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(response, {
      status: response.success ? 201 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 }
    );
  }
}
