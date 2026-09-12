import { z } from "zod";

export const cartLineSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutInitializationSchema = z.object({
  email: z.string().trim().email(),
  contactPhone: z.string().trim().min(7).max(24),
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  line1: z.string().trim().min(5).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().max(24).optional(),
  deliveryMethod: z.enum(["standard", "express"]),
  promotionCode: z.string().trim().max(40).optional(),
  items: z.array(cartLineSchema).min(1).max(20),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]),
});

export type CheckoutInitialization = z.infer<typeof checkoutInitializationSchema>;
