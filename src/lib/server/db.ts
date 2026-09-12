import "temporal-polyfill/full/global";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../prisma/contract.d";
import contractJson from "../../../prisma/contract.json";

/**
 * Process-wide database client. Connection is lazy, so importing this module is
 * safe during builds and only attempts a connection when a query is executed.
 */
export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"],
  poolOptions: {
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 30_000,
  },
});

export const databaseConfigured = Boolean(process.env["DATABASE_URL"]);
