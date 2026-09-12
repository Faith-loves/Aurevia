import "dotenv/config";
import "temporal-polyfill/full/global";
import postgres from "@prisma/orm-postgres/runtime";
import contractJson from "./contract.json" with { type: "json" };
import { catalogProducts } from "./full-catalog-data.mjs";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to seed Aurévia.");
const db = postgres({ contractJson, url: process.env.DATABASE_URL, poolOptions: { max: 10 } });
const collectionSlug = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const skuPart = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, "-");
const key = (...parts) => parts.join(":");

async function main() {
  const [collections, records, images, memberships, variants] = await Promise.all([
    db.orm.public.Collection.all(), db.orm.public.Product.all(), db.orm.public.ProductImage.all(),
    db.orm.public.CollectionProduct.all(), db.orm.public.ProductVariant.all(),
  ]);
  const collectionBySlug = new Map(collections.map((item) => [item.slug, item]));
  for (const name of new Set(catalogProducts.map((product) => product.collection))) {
    const slug = collectionSlug(name);
    if (!collectionBySlug.has(slug)) collectionBySlug.set(slug, await db.orm.public.Collection.create({ name, slug, active: true }));
  }
  const productBySlug = new Map(records.map((item) => [item.slug, item]));
  const imageKeys = new Set(images.map((item) => key(item.productId, item.role, item.sortOrder)));
  const membershipKeys = new Set(memberships.map((item) => key(item.collectionId, item.productId)));
  const variantKeys = new Set(variants.map((item) => key(item.productId, item.size)));

  for (let index = 0; index < catalogProducts.length; index += 10) {
    await Promise.all(catalogProducts.slice(index, index + 10).map(async (product) => {
      let record = productBySlug.get(product.slug);
      if (!record) {
        record = await db.orm.public.Product.create({ name: product.name, slug: product.slug, description: product.description, shortDescription: product.subtitle, fragranceFamily: product.fragranceFamily, concentration: product.concentration, intensity: product.intensity, occasions: [product.collection], tags: product.tags, topNotes: product.topNotes, heartNotes: product.heartNotes, baseNotes: product.baseNotes, featured: product.isFeatured, isNew: product.isNew, bestSeller: product.isBestSeller, active: true });
        productBySlug.set(product.slug, record);
      }
      const collection = collectionBySlug.get(collectionSlug(product.collection));
      if (!collection) throw new Error(`Missing collection for ${product.name}.`);
      const membershipKey = key(collection.id, record.id);
      if (!membershipKeys.has(membershipKey)) { await db.orm.public.CollectionProduct.create({ collectionId: collection.id, productId: record.id, sortOrder: 0 }); membershipKeys.add(membershipKey); }
      await Promise.all([["CATALOG", product.images.catalog], ["EDITORIAL", product.images.editorial], ["DETAIL", product.images.detail], ["GALLERY", product.images.ingredient]].map(async ([role, url]) => { if (!url) return; const imageKey = key(record.id, role, 0); if (!imageKeys.has(imageKey)) { await db.orm.public.ProductImage.create({ productId: record.id, url, role, alt: `${product.name} perfume bottle`, sortOrder: 0 }); imageKeys.add(imageKey); } }));
      await Promise.all(product.sizes.map(async (size) => { const variantKey = key(record.id, size.volume); if (!variantKeys.has(variantKey)) { await db.orm.public.ProductVariant.create({ productId: record.id, size: size.volume, price: size.price, sku: `AUR-${skuPart(product.slug)}-${skuPart(size.volume)}`, stock: size.inStock ? 12 : 0, lowStockThreshold: 4, active: size.inStock }); variantKeys.add(variantKey); } }));
    }));
  }
  console.log(`Seeded or retained ${catalogProducts.length} image-backed Aurévia products.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.close());
