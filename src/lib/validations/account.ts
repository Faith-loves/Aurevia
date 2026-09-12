import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  address: z.string().trim().min(4).max(240),
  apartment: z.string().trim().max(120).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().max(24).optional().default(""),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,18}$/),
  isDefault: z.boolean().optional().default(false),
});
