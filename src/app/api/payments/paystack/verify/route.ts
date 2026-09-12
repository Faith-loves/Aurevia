import { NextResponse } from "next/server";
import { finalizePaidOrder } from "@/lib/server/checkout";

export async function POST(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference") ?? (await request.json().catch(() => null))?.reference;
  if (typeof reference !== "string" || !reference) return NextResponse.json({ error: "A payment reference is required." }, { status: 400 });

  const secret = process.env["PAYSTACK_SECRET_KEY"];
  if (!secret) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const verification = await response.json().catch(() => null) as { status?: boolean; data?: { status?: string; reference?: string } } | null;
  if (!response.ok || !verification?.status || verification.data?.status !== "success" || verification.data.reference !== reference) {
    return NextResponse.json({ error: "Paystack could not verify this transaction." }, { status: 400 });
  }

  try {
    const result = await finalizePaidOrder(reference);
    return NextResponse.json({ orderId: result.order.id, alreadyFinalized: result.alreadyFinalized });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment finalization failed." }, { status: 409 });
  }
}
