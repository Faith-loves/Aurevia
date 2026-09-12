import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "@/lib/auth/guard";
import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";
import { addressSchema } from "@/lib/validations/account";

type Context = { params: Promise<{ id: string }> };

async function ownedAddress(userId: string, id: string) {
  return db.orm.public.Address.where({ id, userId }).first();
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await requireUser();
  if (!session) return unauthorized();
  const { id } = await params;
  if (!(await ownedAddress(session.user.id, id))) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the required address fields." }, { status: 400 });
  const value = parsed.data;
  const updated = await db.transaction(async (tx) => {
    if (value.isDefault) await tx.orm.public.Address.where({ userId: session.user.id }).update({ isDefault: false, updatedAt: databaseNow() });
    return tx.orm.public.Address.where({ id, userId: session.user.id }).update({
      firstName: value.firstName, lastName: value.lastName, line1: value.address, line2: value.apartment || null,
      city: value.city, state: value.state, country: value.country, postalCode: value.postalCode || null,
      phone: value.phone, isDefault: value.isDefault, updatedAt: databaseNow(),
    });
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Context) {
  const session = await requireUser();
  if (!session) return unauthorized();
  const { id } = await params;
  const address = await ownedAddress(session.user.id, id);
  if (!address) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  await db.orm.public.Address.where({ id, userId: session.user.id }).delete();
  return new NextResponse(null, { status: 204 });
}
