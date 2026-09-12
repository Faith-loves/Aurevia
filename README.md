# Aurévia

Aurévia is a modern luxury fragrance storefront inspired by nature, atmosphere, and quiet elegance. The platform brings together a complete, image-backed perfume catalogue, a refined shopping experience, secure account flows, and an admin dashboard for product management.

Built with Next.js, React, TypeScript, PostgreSQL, Prisma 8, and Paystack.

## Highlights

- 119 image-backed fragrances across Parfum, Eau de Parfum, and Eau de Toilette concentrations
- Browse by fragrance family, collection, size, and concentration
- Functional alphabetical, price low-to-high, and price high-to-low product sorting
- Product pages, cart, checkout, account, order, wishlist, and fragrance-guide experiences
- Secure customer authentication and protected account routes
- Admin dashboard for managing products, imagery, variants, and catalogue visibility
- Server-side payment verification with Paystack
- Cloudinary-ready media configuration
- Database catalogue with a checked-in fallback so customers can still browse when the database is temporarily unavailable

## Tech stack

- [Next.js](https://nextjs.org/) 16 and React 19
- TypeScript
- Tailwind CSS and Radix UI
- PostgreSQL with Prisma 8 contract-first ORM
- NextAuth credentials authentication
- Paystack payments
- Cloudinary media management
- Zustand client state

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- A PostgreSQL database, such as Neon or Supabase

### Install

```bash
git clone https://github.com/YOUR-USERNAME/aurevia.git
cd aurevia
npm install
```

### Environment variables

Copy the example file for Next.js and create a separate Prisma CLI environment file:

```powershell
Copy-Item .env.example .env.local
Copy-Item .env.example .env
```

Set the values you use. Keep `.env` and `.env.local` private; they are intentionally excluded from Git.

```ini
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=
ENABLE_DEMO_DELIVERY=false
DEMO_DELIVERY_DELAY_MS=10000
```

For Prisma commands, `DATABASE_URL` must be available in `.env`. Next.js reads it from `.env.local`.

### Database setup

The Prisma 8 source of truth is [prisma/contract.prisma](prisma/contract.prisma). Do not edit generated contract files directly.

```bash
npm run db:contract
npm run db:plan
npm run db:migrate
npm run db:seed
```

`db:seed` is idempotent: it creates missing catalogue data without overwriting existing products, images, or variants. The full seed contains 119 image-backed Aurévia fragrances.

### Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
npm start
```

## Admin access

Create a normal customer account, then promote its database `role` to `ADMIN` using a secure database console or a controlled maintenance script. Aurévia intentionally does not ship with a default administrator password.

## Deployment

1. Push the project to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add the same environment variables to Vercel's Production environment.
4. Set `NEXTAUTH_URL` to your deployed site URL, for example `https://aurevia.vercel.app`.
5. Deploy.

Make sure the production `DATABASE_URL` points to a reachable PostgreSQL database and that its credentials remain server-only.

## Security notes

- Never commit `.env`, `.env.local`, database URLs, Paystack secret keys, or Cloudinary API secrets.
- Prices, product availability, stock, checkout totals, and payment verification are enforced server-side.
- Always verify Paystack payments on the server before creating a paid order.

## License

This project is private and proprietary. All rights reserved.
