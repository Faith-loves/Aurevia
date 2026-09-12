import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}

export async function requireAdmin() {
  const session = await requireUser();
  return session?.user.role === "ADMIN" ? session : null;
}

export function unauthorized() {
  return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
}
