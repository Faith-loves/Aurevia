import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, unauthorized } from "@/lib/auth/guard";
import { findUserById, updateCustomerProfile } from "@/lib/server/users";

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^$|^[+\d][\d\s-]{7,18}$/),
});

function presentUser(user: NonNullable<Awaited<ReturnType<typeof findUserById>>>) {
  return {
    fullName: user.name ?? "",
    email: user.email,
    phone: user.phone ?? "",
    createdAt: user.createdAt?.toString() ?? "",
  };
}

export async function GET() {
  const session = await requireUser();
  if (!session) return unauthorized();
  const user = await findUserById(session.user.id);
  if (!user) return unauthorized();
  return NextResponse.json(presentUser(user));
}

export async function PATCH(request: Request) {
  const session = await requireUser();
  if (!session) return unauthorized();
  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid name and phone number." }, { status: 400 });

  const user = await updateCustomerProfile(session.user.id, {
    name: parsed.data.fullName,
    phone: parsed.data.phone || null,
  });
  return NextResponse.json(presentUser(user));
}
