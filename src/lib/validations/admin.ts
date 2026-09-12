import { z } from "zod";

const variantSchema = z.object({
  id: z.string().uuid().optional(), volume: z.string().trim().min(1).max(30), price: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).nullable().optional(), sku: z.string().trim().min(2).max(100),
  stock: z.number().int().min(0), lowStockThreshold: z.number().int().min(0), active: z.boolean(),
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(2).max(160), slug: z.string().regex(/^[a-z0-9-]+$/), subtitle: z.string().trim().max(240).optional(),
  description: z.string().trim().min(10).max(6000), family: z.string().trim().min(2).max(80), concentration: z.string().trim().min(2).max(80),
  intensity: z.enum(["Light", "Moderate", "Strong"]), topNotes: z.array(z.string().trim().min(1).max(80)).max(20),
  heartNotes: z.array(z.string().trim().min(1).max(80)).max(20), baseNotes: z.array(z.string().trim().min(1).max(80)).max(20),
  occasions: z.array(z.string().trim().min(1).max(80)).max(20), status: z.enum(["Active", "Draft"]), featured: z.boolean(),
  newArrival: z.boolean(), bestSeller: z.boolean(), tags: z.array(z.string().trim().min(1).max(80)).max(30).optional().default([]),
  images: z.object({ catalog: z.string().trim().min(1).max(1000), editorial: z.string().trim().max(1000).optional(), detail: z.string().trim().max(1000).optional(), ingredient: z.string().trim().max(1000).optional() }),
  variants: z.array(variantSchema).min(1).max(10),
}).superRefine((product, context) => {
  if (new Set(product.variants.map((variant) => variant.volume.toLowerCase())).size !== product.variants.length) context.addIssue({ code: "custom", message: "Variant sizes must be unique." });
});
