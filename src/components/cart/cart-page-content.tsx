"use client";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/data/products";
import { useAdminStore } from "@/store/admin-store";
import { cartDiscount, cartSubtotal, useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
export function CartPageContent() {
  const items = useCartStore((s) => s.items),
    promo = useCartStore((s) => s.promo),
    remove = useCartStore((s) => s.removeItem),
    update = useCartStore((s) => s.updateQuantity),
    apply = useCartStore((s) => s.applyPromo),
    removePromo = useCartStore((s) => s.removePromo),
    toggleWishlist = useWishlistStore((s) => s.toggle),
    managedProducts = useAdminStore((s) => s.products),
    [promoError, setPromoError] = useState("");
  const subtotal = cartSubtotal(items),
    discount = cartDiscount(items, promo);
  const stockIssues = items.filter((item) => {
    const variant = managedProducts
      .find((p) => p.id === item.productId)
      ?.variants.find((v) => v.volume === item.size);
    return variant ? !variant.active || item.quantity > variant.stock : false;
  });
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("promo") || "");
    setPromoError(apply(code) ? "" : "That code isn't valid.");
  }
  if (!items.length)
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-center">
        <div>
          <ShoppingBag className="mx-auto size-9 text-aurevia-gold" />
          <h1 className="text-display mt-5 text-primary">Your bag is empty.</h1>
          <p className="mt-4 text-muted-foreground">
            Discover a fragrance worth carrying with you.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/shop">Shop Fragrances</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/fragrance-finder">Find My Scent</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
      <section>
        <h1 className="text-display text-primary">Your Bag</h1>
        <div className="mt-8">
          {items.map((item) => (
            <article
              key={item.lineId}
              className="grid grid-cols-[6rem_1fr] gap-4 border-t py-6 sm:grid-cols-[8rem_1fr_auto]"
            >
              <Image
                src={item.image}
                alt=""
                width={160}
                height={200}
                className="h-36 w-28 object-cover"
              />
              <div>
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-2xl font-semibold text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.family} · {item.size}
                </p>
                <p className="mt-3 font-semibold">
                  {formatPrice(item.unitPrice)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center border">
                    <button
                      onClick={() => update(item.lineId, item.quantity - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="size-10"
                    >
                      <Minus className="mx-auto size-4" />
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => update(item.lineId, item.quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="size-10"
                    >
                      <Plus className="mx-auto size-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      toggleWishlist(item.slug);
                      remove(item.lineId);
                    }}
                    className="text-sm font-semibold text-primary underline"
                  >
                    Save for later
                  </button>
                  <button
                    onClick={() => remove(item.lineId)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                </div>
              </div>
              <p className="col-start-2 font-semibold sm:col-start-3">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </article>
          ))}
        </div>
      </section>
      <aside className="h-fit bg-aurevia-cream p-6 lg:sticky lg:top-32">
        <h2 className="font-display text-3xl text-primary">Order Summary</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount</dt>
              <dd>−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>Calculated at checkout</dd>
          </div>
          <div className="flex justify-between border-t pt-4 text-base font-semibold">
            <dt>Estimated total</dt>
            <dd>{formatPrice(subtotal - discount)}</dd>
          </div>
        </dl>
        {promo ? (
          <div className="mt-6 rounded-lg border border-success/30 p-3 text-sm">
            <strong>AUREVIA10 — 10% off</strong>
            <button onClick={removePromo} className="ml-3 underline">
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6">
            <label htmlFor="promo" className="text-sm font-semibold">
              Promo code
            </label>
            <div className="mt-2 flex gap-2">
              <Input id="promo" name="promo" placeholder="Promo code" />
              <Button variant="outline">Apply</Button>
            </div>
            {promoError && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {promoError}
              </p>
            )}
          </form>
        )}
        {stockIssues.length > 0 && (
          <p role="alert" className="mt-5 border border-warning/40 p-3 text-sm">
            Stock changed for {stockIssues.map((item) => item.name).join(", ")}.
            Reduce the quantity or choose another available size before checkout.
          </p>
        )}
        {stockIssues.length ? (
          <Button disabled size="lg" className="mt-6 h-14 w-full">
            Resolve Stock Availability
          </Button>
        ) : (
          <Button asChild size="lg" className="mt-6 h-14 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        )}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Estimated delivery: 2–5 business days. Final options and cost are
          calculated at checkout.
        </p>
        <Link
          href="/shop"
          className="mt-5 block text-center text-sm font-semibold text-primary underline"
        >
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
