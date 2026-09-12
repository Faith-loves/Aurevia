import type { Product } from "@/data/products";
import { products as developmentCatalog } from "@/data/products";
import { databaseConfigured, db } from "@/lib/server/db";

type CatalogRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  fragranceFamily: Product["fragranceFamily"];
  concentration: Product["concentration"];
  intensity: Product["intensity"];
  tags: string[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  occasions: string[];
  images: Array<{ url: string; role: "CATALOG" | "EDITORIAL" | "GALLERY" | "DETAIL" }>;
  variants: Array<{ id: string; size: string; price: number; stock: number; active: boolean; lowStockThreshold: number }>;
};

let catalogDatabaseUnavailableUntil = 0;
const CATALOG_DATABASE_COOLDOWN_MS = 60_000;

function withCatalogTimeout<T>(operation: Promise<T>) {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Catalog database request timed out.")), 4_000)),
  ]);
}

function toStorefrontProduct(record: CatalogRecord): Product {
  const images = record.images;
  const catalog = images.find((image) => image.role === "CATALOG")?.url ?? images[0]?.url ?? "/images/placeholder-perfume.jpg";
  const gallery = images.map((image) => image.url);
  const variants = record.variants.filter((variant) => variant.active);
  const sizes = variants.map((variant) => ({ id: variant.id, volume: variant.size, price: variant.price, inStock: variant.stock > 0, stock: variant.stock, threshold: variant.lowStockThreshold }));
  const available = sizes.filter((size) => size.inStock);
  const price = Math.min(...(available.length ? available : sizes).map((size) => size.price));

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    subtitle: record.shortDescription ?? record.fragranceFamily,
    description: record.description,
    price,
    currency: "NGN",
    image: catalog,
    images: {
      catalog,
      editorial: images.find((image) => image.role === "EDITORIAL")?.url,
      detail: images.find((image) => image.role === "DETAIL")?.url,
      ingredient: images.find((image) => image.role === "GALLERY")?.url,
    },
    gallery: gallery.length ? gallery : [catalog],
    sizes,
    reviews: [],
    fragranceFamily: record.fragranceFamily,
    tags: record.tags,
    topNotes: record.topNotes,
    heartNotes: record.heartNotes,
    baseNotes: record.baseNotes,
    intensity: record.intensity,
    gender: "Unisex",
    size: sizes.map((size) => size.volume).join(" / "),
    concentration: record.concentration,
    rating: 5,
    reviewCount: 0,
    isNew: record.isNew,
    isBestSeller: record.bestSeller,
    isFeatured: record.featured,
    stockStatus: variants.some((variant) => variant.stock > 0 && variant.stock <= 4) ? "Low Stock" : "In Stock",
    collection: record.occasions[0] ?? "Aurévia",
  };
}

export async function getCatalogProducts() {
  if (!databaseConfigured) return developmentCatalog;
  if (Date.now() < catalogDatabaseUnavailableUntil) return developmentCatalog;
  try {
    const records = await withCatalogTimeout((async () => await db.orm.public.Product
      .where({ active: true })
      .include("images", (images) => images.orderBy((image) => image.sortOrder.asc()))
      .include("variants", (variants) => variants.orderBy((variant) => variant.price.asc()))
      .orderBy((product) => product.name.asc())
      .all())());
    return (records as unknown as CatalogRecord[]).map(toStorefrontProduct);
  } catch (error) {
    catalogDatabaseUnavailableUntil = Date.now() + CATALOG_DATABASE_COOLDOWN_MS;
    console.error("Catalog database read failed; using the checked-in catalog.", error);
    return developmentCatalog;
  }
}

export async function getCatalogProduct(slug: string) {
  return (await getCatalogProducts()).find((product) => product.slug === slug) ?? null;
}
