import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { createPendingOrder } from "@/lib/server/checkout";
import { checkoutInitializationSchema } from "@/lib/validations/commerce";

export async function POST(request: Request) {
  const parsed = checkoutInitializationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });

  try {
    const secret = process.env["PAYSTACK_SECRET_KEY"];
    if (!secret) {
      return NextResponse.json({ error: "Payments are not configured. Add PAYSTACK_SECRET_KEY to enable checkout." }, { status: 503 });
    }
    const session = await requireUser();
    const { order, quote, paymentReference } = await createPendingOrder(parsed.data, session?.user.id ?? null);

    const callbackUrl = new URL(`/order-confirmation/${order.id}`, request.url).toString();
    const paymentResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email, amount: quote.total * 100, reference: paymentReference, callback_url: callbackUrl, metadata: { orderId: order.id } }),
      cache: "no-store",
    });
    const payment = await paymentResponse.json().catch(() => null) as { status?: boolean; data?: { authorization_url?: string } } | null;
    if (!paymentResponse.ok || !payment?.status || !payment.data?.authorization_url) {
      return NextResponse.json({ error: "Paystack could not initialize this transaction." }, { status: 502 });
    }

    return NextResponse.json({ orderId: order.id, reference: paymentReference, authorizationUrl: payment.data.authorization_url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout could not be initialized." }, { status: 400 });
  }
}
