"use client";
import { Heart, Menu, Search, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { products, formatPrice } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist-store";
import { CartDrawer } from "./cart-drawer";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?collection=new" },
  { label: "Best Sellers", href: "/shop?collection=best-sellers" },
  { label: "Gifts", href: "/shop?collection=gifting" },
  { label: "Collections", href: "/shop?collection=after-dark" },
  { label: "Find Your Scent", href: "/fragrance-finder" },
];
function SearchExperience() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? products
        .filter((p) =>
          [
            p.name,
            p.fragranceFamily,
            p.collection,
            ...p.topNotes,
            ...p.heartNotes,
            ...p.baseNotes,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
        .slice(0, 5)
    : [];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="group relative inline-flex size-11 items-center justify-center"
          aria-label="Search fragrances"
        >
          <Search className="size-5" />
          <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-md bg-aurevia-plum px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-aurevia-ivory opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="top-24 max-w-2xl translate-y-0 p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-heading-3 text-primary">
            Search Aurévia
          </DialogTitle>
          <DialogDescription>
            Search by fragrance, family, note, or collection.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Try vanilla, woody, or rose"
          aria-label="Search fragrances"
          className="h-12 text-base"
        />
        {q && (
          <div className="max-h-[55vh] overflow-y-auto">
            {results.length ? (
              results.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="flex items-center gap-4 border-b py-3"
                >
                  <Image
                    src={p.image}
                    alt=""
                    width={64}
                    height={80}
                    className="h-16 w-14 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <strong className="block font-display text-xl text-primary">
                      {p.name}
                    </strong>
                    <span className="text-xs text-muted-foreground">
                      {p.fragranceFamily} · {formatPrice(p.price)}
                    </span>
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="font-display text-2xl text-primary">
                  No fragrances found
                </p>
                <p className="mt-1 text-muted-foreground">
                  Try another scent, note, or fragrance family.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block font-semibold text-primary underline"
                >
                  Explore All Fragrances
                </Link>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function StoreHeader() {
  const wishlistCount = useWishlistStore((state) => state.slugs.length);
  const accountHref = "/account";
  return (
    <>
      <div className="bg-aurevia-plum px-4 py-2 text-center text-xs tracking-wide text-aurevia-ivory">
        Complimentary delivery on orders over ₦75,000
      </div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-aurevia-ivory/95">
        <nav
          aria-label="Main navigation"
          className="aurevia-container flex h-20 items-center justify-between gap-4"
        >
          <div className="hidden flex-1 items-center gap-5 lg:flex">
            {links.slice(0, 5).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs font-semibold uppercase tracking-[.08em] hover:text-aurevia-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex size-11 items-center justify-center lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-aurevia-ivory">
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src="/images/aurevia-logo.png"
                    alt="Aurévia"
                    width={2172}
                    height={724}
                    className="h-auto w-36"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-5 pt-6">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="border-b py-4 font-display text-2xl text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  className="border-b py-4 font-display text-2xl text-primary"
                >
                  Account
                </Link>
                <Link
                  href="/wishlist"
                  className="border-b py-4 font-display text-2xl text-primary"
                >
                  Wishlist
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/home" className="shrink-0" aria-label="Aurévia home">
            <Image
              src="/images/aurevia-logo.png"
              alt="Aurévia"
              width={2172}
              height={724}
              priority
              className="h-auto w-32 sm:w-40"
            />
          </Link>
          <div className="flex flex-1 items-center justify-end gap-1">
            <Link
              href="/fragrance-finder"
              className="mr-2 hidden text-xs font-semibold uppercase tracking-[.08em] xl:block"
            >
              Find Your Scent
            </Link>
            <SearchExperience />
            <Link
              href={accountHref}
              aria-label="Account"
              className="group relative hidden size-11 items-center justify-center sm:inline-flex"
            >
              <UserRound className="size-5" />
              <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-md bg-aurevia-plum px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-aurevia-ivory opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Account</span>
            </Link>
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="group relative hidden size-11 items-center justify-center sm:inline-flex"
            >
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-aurevia-gold px-1 text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
              <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-md bg-aurevia-plum px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-aurevia-ivory opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Wishlist</span>
            </Link>
            <CartDrawer />
          </div>
        </nav>
      </header>
    </>
  );
}
