import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth/guard";
import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";
import { addressSchema } from "@/lib/validations/account";

function presentAddress(address: Record<string, unknown>) {
  return {
    id: String(address.id), firstName: String(address.firstName), lastName: String(address.lastName),
    address: String(address.line1), apartment: String(address.line2 ?? ""), city: String(address.city),
    state: String(address.state), country: String(address.country), postalCode: String(address.postalCode ?? ""),
    phone: String(address.phone), isDefault: Boolean(address.isDefault),
  };
}

export async function GET() {
  const session = await requireUser();
  if (!session) return unauthorized();
  const addresses = await db.orm.public.Address.where({ userId: session.user.id }).orderBy((address) => address.createdAt.asc()).all();
  return NextResponse.json(addresses.map((address) => presentAddress(address as Record<string, unknown>)));
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (!session) return unauthorized();
  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the required address fields." }, { status: 400 });
  const value = parsed.data;
  const created = await db.transaction(async (tx) => {
    const count = Number(await tx.orm.public.Address.where({ userId: session.user.id }).count());
    if (value.isDefault || count === 0) await tx.orm.public.Address.where({ userId: session.user.id }).update({ isDefault: false, updatedAt: databaseNow() });
    return tx.orm.public.Address.create({
      userId: session.user.id, firstName: value.firstName, lastName: value.lastName, line1: value.address,
      line2: value.apartment || null, city: value.city, state: value.state, country: value.country,
      postalCode: value.postalCode || null, phone: value.phone, isDefault: value.isDefault || count === 0,
      createdAt: databaseNow(), updatedAt: databaseNow(),
    });
  });
  return NextResponse.json(presentAddress(created as Record<string, unknown>), { status: 201 });
}
