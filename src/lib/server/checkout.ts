import { randomUUID } from "node:crypto";
import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";
import type { CheckoutInitialization } from "@/lib/validations/commerce";

const DELIVERY_FEES = { standard: 3500, express: 7500 } as const;

type QuoteLine = {
  variantId: string;
  productId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
};

type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  promotionCode: string | null;
};

function makeOrderNumber() {
  return `AUR-${new Date().getUTCFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export async function quoteCheckout(input: CheckoutInitialization): Promise<Quote> {
  const normalizedLines = new Map<string, number>();
  for (const item of input.items) normalizedLines.set(item.variantId, (normalizedLines.get(item.variantId) ?? 0) + item.quantity);

  const lines: QuoteLine[] = [];
  for (const [variantId, quantity] of normalizedLines) {
    const variant = await db.orm.public.ProductVariant.first({ id: variantId });
    if (!variant || !variant.active || variant.stock < quantity) throw new Error("One or more selected sizes are no longer available.");

    const product = await db.orm.public.Product.first({ id: variant.productId });
    if (!product?.active) throw new Error("One or more selected perfumes are no longer available.");

    const catalog = await db.orm.public.ProductImage.where({ productId: product.id, role: "CATALOG", sortOrder: 0 }).first();
    lines.push({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      variantLabel: variant.size,
      sku: variant.sku,
      imageUrl: catalog?.url ?? null,
      unitPrice: variant.price,
      quantity,
    });
  }

  const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
  let discountAmount = 0;
  let promotionCode: string | null = null;
  if (input.promotionCode) {
    const promotion = await db.orm.public.Promotion.where((row) => row.code.eq(input.promotionCode!.toUpperCase())).first();
    const now = databaseNow();
    if (!promotion) throw new Error("That promotion cannot be applied to this order.");
    const activeUsages = Number(await db.orm.public.PromotionUsage.where({ promotionId: promotion.id }).count());
    const eligible = promotion.active && promotion.startsAt <= now && promotion.endsAt >= now &&
      subtotal >= (promotion.minimumOrder ?? 0) &&
      (!promotion.usageLimit || activeUsages < promotion.usageLimit);
    if (!eligible) throw new Error("That promotion cannot be applied to this order.");
    discountAmount = promotion.type === "PERCENTAGE"
      ? Math.round((subtotal * promotion.value) / 100)
      : Math.min(subtotal, promotion.value);
    promotionCode = promotion.code;
  }

  const shippingAmount = DELIVERY_FEES[input.deliveryMethod];
  return { lines, subtotal, discountAmount, shippingAmount, total: subtotal - discountAmount + shippingAmount, promotionCode };
}

export async function createPendingOrder(input: CheckoutInitialization, userId: string | null) {
  const quote = await quoteCheckout(input);
  const paymentReference = `aur_${randomUUID().replaceAll("-", "")}`;
  const order = await db.transaction(async (tx) => {
    const created = await tx.orm.public.Order.create({
      orderNumber: makeOrderNumber(),
      userId,
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      paymentProvider: "PAYSTACK",
      paymentReference,
      subtotal: quote.subtotal,
      discountAmount: quote.discountAmount,
      shippingAmount: quote.shippingAmount,
      total: quote.total,
      promotionCode: quote.promotionCode,
      shippingAddress: {
        firstName: input.firstName, lastName: input.lastName, line1: input.line1, line2: input.line2 ?? null,
        city: input.city, state: input.state, country: input.country, postalCode: input.postalCode ?? null,
        phone: input.contactPhone, deliveryMethod: input.deliveryMethod,
      },
      createdAt: databaseNow(), updatedAt: databaseNow(),
    });

    for (const line of quote.lines) {
      await tx.orm.public.OrderItem.create({
        orderId: created.id, productId: line.productId, variantId: line.variantId, productName: line.productName,
        variantLabel: line.variantLabel, sku: line.sku, unitPrice: line.unitPrice, quantity: line.quantity,
        imageUrl: line.imageUrl,
      });
    }
    return created;
  });
  return { order, quote, paymentReference };
}

export async function finalizePaidOrder(reference: string) {
  return db.transaction(async (tx) => {
    const order = await tx.orm.public.Order.where({ paymentReference: reference }).first();
    if (!order) throw new Error("Payment reference was not found.");
    if (order.paymentStatus === "PAID") return { order, alreadyFinalized: true };

    const items = await tx.orm.public.OrderItem.where({ orderId: order.id }).all();
    for (const item of items) {
      if (!item.variantId) throw new Error("Order item has no purchasable variant.");
      const variant = await tx.orm.public.ProductVariant.first({ id: item.variantId });
      if (!variant || !variant.active || variant.stock < item.quantity) throw new Error("A paid order cannot be fulfilled because stock changed.");
      await tx.orm.public.ProductVariant.where({ id: variant.id }).update({ stock: variant.stock - item.quantity, updatedAt: databaseNow() });
      await tx.orm.public.InventoryAdjustment.create({ variantId: variant.id, quantityDelta: -item.quantity, reason: "ORDER", adminId: null, createdAt: databaseNow() });
    }

    const paidAt = databaseNow();
    const finalized = await tx.orm.public.Order.where({ id: order.id }).update({ paymentStatus: "PAID", paidAt, updatedAt: paidAt });
    await tx.orm.public.OrderStatusHistory.create({ orderId: order.id, status: "CONFIRMED", actorId: null, createdAt: paidAt });
    await tx.orm.public.Notification.create({ audience: "ADMIN", type: "NEW_ORDER", title: "New order received", message: `Order #${order.orderNumber} has been paid.`, orderId: order.id, createdAt: paidAt, userId: null });
    if (order.userId) await tx.orm.public.Notification.create({ audience: "CUSTOMER", type: "ORDER_CONFIRMED", title: "Order confirmed", message: `Your order #${order.orderNumber} is confirmed.`, orderId: order.id, createdAt: paidAt, userId: order.userId });

    if (order.promotionCode) {
      const promotion = await tx.orm.public.Promotion.where({ code: order.promotionCode }).first();
      if (promotion) await tx.orm.public.PromotionUsage.create({ promotionId: promotion.id, userId: order.userId, orderId: order.id, createdAt: paidAt });
    }
    if (!finalized) throw new Error("Order could not be finalized.");
    return { order: finalized, alreadyFinalized: false };
  });
}
