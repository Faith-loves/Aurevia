"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const groups = [
  {
    title: "Shop",
    items: [
      ["All Fragrances", "/shop"],
      ["New Arrivals", "/shop?collection=new"],
      ["Best Sellers", "/shop?collection=best-sellers"],
      ["Gifts", "/shop?collection=gifting"],
      ["Collections", "/shop?collection=after-dark"],
    ],
  },
  {
    title: "Discover",
    items: [
      ["Find Your Scent", "/fragrance-finder"],
      ["Fragrance Guide", "/fragrance-guide"],
      ["Fragrance Families", "/fragrance-guide/families"],
      ["Our Story", "/about"],
    ],
  },
  {
    title: "Help",
    items: [
      ["Help Centre", "/help"],
      ["Contact", "/contact"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Account",
    items: [
      ["My Account", "/account"],
      ["Orders", "/account/orders"],
      ["Wishlist", "/wishlist"],
      ["Sign In", "/sign-in"],
    ],
  },
  {
    title: "Legal",
    items: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];
export function StoreFooter() {
  const [message, setMessage] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    setMessage(
      /^\S+@\S+\.\S+$/.test(email)
        ? "Thank you — you're on our development preview list."
        : "Enter a valid email address.",
    );
  }
  return (
    <footer className="bg-aurevia-plum text-aurevia-ivory">
      <div className="aurevia-container grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <h2 className="font-display text-3xl">Notes from Aurévia</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-aurevia-ivory/70">
            New fragrances, scent stories and considered recommendations —
            occasionally delivered.
          </p>
          <form onSubmit={submit} className="mt-5 flex max-w-md gap-2">
            <Input
              name="email"
              type="email"
              aria-label="Newsletter email"
              placeholder="Email address"
              className="h-12 bg-aurevia-ivory text-aurevia-charcoal"
            />
            <Button className="h-12 bg-aurevia-gold text-aurevia-charcoal">
              Join
            </Button>
          </form>
          {message && (
            <p
              aria-live="polite"
              className="mt-2 text-xs text-aurevia-ivory/75"
            >
              {message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-aurevia-gold">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {g.items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-aurevia-ivory/75 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="aurevia-container flex flex-col gap-3 py-5 text-xs text-aurevia-ivory/60 sm:flex-row sm:justify-between">
          <span>© 2026 Aurévia</span>
          <span>
            <Link href="/privacy">Privacy</Link> ·{" "}
            <Link href="/terms">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
