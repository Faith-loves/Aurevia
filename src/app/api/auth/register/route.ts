import { NextResponse } from "next/server";
import { createAccountSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth/password";
import { createCustomer, findUserByEmail } from "@/lib/server/users";

export async function POST(request: Request) {
  const parsed = createAccountSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please correct the highlighted fields." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (await findUserByEmail(email)) {
    return NextResponse.json({ error: "An account already exists for this email address." }, { status: 409 });
  }

  const user = await createCustomer({
    name: parsed.data.fullName.trim(),
    email,
    passwordHash: await hashPassword(parsed.data.password),
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
