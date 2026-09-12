import { db } from "@/lib/server/db";
import { databaseNow } from "@/lib/server/time";

export type AppUser = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  role: "CUSTOMER" | "ADMIN";
  phone: string | null;
  createdAt?: Temporal.Instant;
};

export async function findUserByEmail(email: string) {
  return db.orm.public.User.where((user) => user.email.eq(email.toLowerCase())).first() as Promise<AppUser | null>;
}

export async function findUserById(id: string) {
  return db.orm.public.User.first({ id }) as Promise<AppUser | null>;
}

export async function createCustomer(input: { name: string; email: string; passwordHash: string }) {
  return db.orm.public.User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    role: "CUSTOMER",
    createdAt: databaseNow(),
    updatedAt: databaseNow(),
  }) as Promise<AppUser>;
}

export async function updateCustomerProfile(userId: string, input: { name: string; phone: string | null }) {
  return db.orm.public.User.where({ id: userId }).update({
    name: input.name,
    phone: input.phone,
    updatedAt: databaseNow(),
  }) as Promise<AppUser>;
}
