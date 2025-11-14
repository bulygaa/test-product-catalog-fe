import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-fetch";
import { IProduct } from "@/shared-types/src/product-types";
import { IApiResponse } from "@/shared-types/src/api-types";

interface IRouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: IRouteParams) {
  try {
    const body = await request.json();
    const { slug } = await params;

    const response = await apiFetch<IApiResponse<IProduct>>(
      `/products/${encodeURIComponent(slug)}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: IRouteParams) {
  try {
    const { slug } = await params;

    const response = await apiFetch<IApiResponse<null>>(
      `/products/${encodeURIComponent(slug)}`,
      {
        method: "DELETE",
      }
    );

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
