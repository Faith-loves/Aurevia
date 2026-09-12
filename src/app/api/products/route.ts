import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCatalogProducts());
}
