import { NextResponse } from "next/server";
import { requireAdmin, forbidden } from "@/lib/auth/guard";
import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";
import { adminProductSchema } from "@/lib/validations/admin";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  const product = await db.orm.public.Product.where({ id }).include("images", (images) => images.orderBy((image) => image.sortOrder.asc())).include("variants", (variants) => variants.orderBy((variant) => variant.price.asc())).first();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const record = product as unknown as Record<string, unknown>;
  const images = record.images as Array<Record<string, unknown>>;
  const image = (role: string) => images.find((item) => item.role === role)?.url as string | undefined;
  return NextResponse.json({
    id: String(record.id), name: String(record.name), slug: String(record.slug), subtitle: String(record.shortDescription ?? ""), description: String(record.description), family: String(record.fragranceFamily), concentration: String(record.concentration), intensity: String(record.intensity), topNotes: record.topNotes, heartNotes: record.heartNotes, baseNotes: record.baseNotes, occasions: record.occasions,
    images: { catalog: image("CATALOG") ?? "", editorial: image("EDITORIAL"), detail: image("DETAIL"), ingredient: image("GALLERY") },
    variants: (record.variants as Array<Record<string, unknown>>).map((variant) => ({ id: String(variant.id), volume: String(variant.size), price: Number(variant.price), compareAtPrice: variant.compareAtPrice === null ? undefined : Number(variant.compareAtPrice), sku: String(variant.sku), stock: Number(variant.stock), lowStockThreshold: Number(variant.lowStockThreshold), active: Boolean(variant.active) })),
    collections: [], status: record.active ? "Active" : "Draft", featured: Boolean(record.featured), newArrival: Boolean(record.isNew), bestSeller: Boolean(record.bestSeller), createdAt: String(record.createdAt), updatedAt: String(record.updatedAt),
  });
}

export async function PATCH(request: Request, { params }: Context) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  const parsed = adminProductSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please correct the product details." }, { status: 400 });
  if (!(await db.orm.public.Product.first({ id }))) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const product = parsed.data;
  try {
    await db.transaction(async (tx) => {
      const now = databaseNow();
      await tx.orm.public.Product.where({ id }).update({ name: product.name, slug: product.slug, description: product.description, shortDescription: product.subtitle || null, fragranceFamily: product.family, concentration: product.concentration, intensity: product.intensity, occasions: product.occasions, tags: product.tags, topNotes: product.topNotes, heartNotes: product.heartNotes, baseNotes: product.baseNotes, featured: product.featured, isNew: product.newArrival, bestSeller: product.bestSeller, active: product.status === "Active", updatedAt: now });
      for (const variant of product.variants) {
        const existingVariant = variant.id ? await tx.orm.public.ProductVariant.where({ id: variant.id, productId: id }).first() : null;
        if (existingVariant) await tx.orm.public.ProductVariant.where({ id: variant.id!, productId: id }).update({ size: variant.volume, price: variant.price, compareAtPrice: variant.compareAtPrice ?? null, sku: variant.sku, stock: variant.stock, lowStockThreshold: variant.lowStockThreshold, active: variant.active, updatedAt: now });
        else await tx.orm.public.ProductVariant.create({ productId: id, size: variant.volume, price: variant.price, compareAtPrice: variant.compareAtPrice ?? null, sku: variant.sku, stock: variant.stock, lowStockThreshold: variant.lowStockThreshold, active: variant.active, createdAt: now, updatedAt: now });
      }
    });
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "That slug or SKU is already in use." }, { status: 409 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  if (!(await requireAdmin())) return forbidden();
  const { id } = await params;
  if (!(await db.orm.public.Product.first({ id }))) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  await db.orm.public.Product.where({ id }).update({ active: false, updatedAt: databaseNow() });
  return new NextResponse(null, { status: 204 });
}
