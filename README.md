# Aurévia

A luxury fragrance storefront built with Next.js, React, TypeScript, Prisma and PostgreSQL. The interface retains the established Aurévia editorial system; Phase 10 introduces the production database contract and controlled seed data.

## Production catalog

The production seed contains only the 14 approved perfumes specified for Phase 10. It is deliberately idempotent: running it again creates missing records but does not overwrite existing product, image, or variant changes.

## Required environment variables

Copy `.env.example` to `.env.local` and populate only the values you use:

```bash
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=
ENABLE_DEMO_DELIVERY=false
DEMO_DELIVERY_DELAY_MS=10000
```

Use a Vercel-compatible PostgreSQL database such as Neon or Supabase. Never commit `.env.local` or production keys.

## Database setup

The Prisma 8 source of truth is `prisma/contract.prisma`. The generated `contract.json` and `contract.d.ts` are checked in for the PostgreSQL runtime; do not edit those generated files. The initial additive migration plan is committed under `migrations/app/`.

Copy the database URL to both `.env.local` (for Next.js) and the ignored `.env` (for Prisma CLI commands), then run:

```bash
npm run db:contract
npm run db:plan       # review the generated plan before applying it
npm run db:migrate    # applies the reviewed plan to the configured database
npm run db:seed
```

The migration command is deliberately separate from planning. Do not run it against a production database until the generated operations have been reviewed. Do not seed on application startup.

To establish the initial administrator, register a normal account and promote its `role` to `ADMIN` using a secure database console or a controlled maintenance script. The intended address is supplied through `ADMIN_EMAIL`; no default admin password exists.

## Payments and media

Paystack and Cloudinary require their own accounts and environment variables. Keep `PAYSTACK_SECRET_KEY` and `CLOUDINARY_API_SECRET` server-only. The payment flow must create orders only after server-side Paystack verification; browser totals and callbacks are not authoritative.

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

The database uses Prisma 8's contract-first PostgreSQL runtime (`@prisma/orm-postgres`). Browser state is not trusted for catalog mutations, checkout totals, stock, or payments; use the authenticated server routes.
