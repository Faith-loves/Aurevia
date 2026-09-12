import { NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth/guard";
import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";
import { adminProductSchema } from "@/lib/validations/admin";

type Row = Record<string, unknown>;
function toAdminProduct(product: Row) {
  const images = (product.images ?? []) as Row[];
  const imageByRole = (role: string) => images.find((image) => image.role === role)?.url as string | undefined;
  return {
    id: String(product.id), name: String(product.name), slug: String(product.slug), subtitle: String(product.shortDescription ?? ""), description: String(product.description),
    family: String(product.fragranceFamily), concentration: String(product.concentration), intensity: String(product.intensity),
    topNotes: product.topNotes as string[], heartNotes: product.heartNotes as string[], baseNotes: product.baseNotes as string[], occasions: product.occasions as string[],
    images: { catalog: imageByRole("CATALOG") ?? "", editorial: imageByRole("EDITORIAL"), detail: imageByRole("DETAIL"), ingredient: imageByRole("GALLERY") },
    variants: ((product.variants ?? []) as Row[]).map((variant) => ({ id: String(variant.id), volume: String(variant.size), price: Number(variant.price), compareAtPrice: variant.compareAtPrice === null ? undefined : Number(variant.compareAtPrice), sku: String(variant.sku), stock: Number(variant.stock), lowStockThreshold: Number(variant.lowStockThreshold), active: Boolean(variant.active) })),
    status: product.active ? "Active" : "Draft", featured: Boolean(product.featured), newArrival: Boolean(product.isNew), bestSeller: Boolean(product.bestSeller),
    createdAt: String(product.createdAt), updatedAt: String(product.updatedAt),
  };
}

export async function GET() {
  if (!(await requireAdmin())) return forbidden();
  const products = await db.orm.public.Product.include("images", (images) => images.orderBy((image) => image.sortOrder.asc())).include("variants", (variants) => variants.orderBy((variant) => variant.price.asc())).orderBy((product) => product.name.asc()).all();
  return NextResponse.json((products as unknown as Row[]).map(toAdminProduct));
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return forbidden();
  const parsed = adminProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please correct the product details." }, { status: 400 });
  const product = parsed.data;
  try {
    const created = await db.transaction(async (tx) => {
      const now = databaseNow();
      const record = await tx.orm.public.Product.create({ name: product.name, slug: product.slug, description: product.description, shortDescription: product.subtitle || null, fragranceFamily: product.family, concentration: product.concentration, intensity: product.intensity, occasions: product.occasions, tags: product.tags, topNotes: product.topNotes, heartNotes: product.heartNotes, baseNotes: product.baseNotes, featured: product.featured, isNew: product.newArrival, bestSeller: product.bestSeller, active: product.status === "Active", createdAt: now, updatedAt: now });
      for (const [role, url] of [["CATALOG", product.images.catalog], ["EDITORIAL", product.images.editorial], ["DETAIL", product.images.detail], ["GALLERY", product.images.ingredient]] as const) if (url) await tx.orm.public.ProductImage.create({ productId: record.id, url, role, alt: `${product.name} perfume`, sortOrder: 0 });
      for (const variant of product.variants) await tx.orm.public.ProductVariant.create({ productId: record.id, size: variant.volume, price: variant.price, compareAtPrice: variant.compareAtPrice ?? null, sku: variant.sku, stock: variant.stock, lowStockThreshold: variant.lowStockThreshold, active: variant.active, createdAt: now, updatedAt: now });
      return record;
    });
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "A product with that slug or SKU already exists." }, { status: 409 });
  }
}
