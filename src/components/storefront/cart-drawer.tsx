"use client";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/data/products";
import { cartCount, cartSubtotal, useCartStore } from "@/store/cart-store";
export function CartDrawer() {
  const items = useCartStore((s) => s.items),
    open = useCartStore((s) => s.drawerOpen),
    setOpen = useCartStore((s) => s.setDrawerOpen),
    remove = useCartStore((s) => s.removeItem),
    update = useCartStore((s) => s.updateQuantity);
  const count = cartCount(items);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={`Cart, ${count} items`}
          className="group relative inline-flex size-11 items-center justify-center"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-aurevia-gold px-1 text-[10px] font-bold text-aurevia-charcoal">
              {count}
            </span>
          )}
          <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-md bg-aurevia-plum px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-aurevia-ivory opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Cart</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-aurevia-ivory sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl text-primary">
            Your Bag
          </SheetTitle>
          <SheetDescription>
            {count} {count === 1 ? "item" : "items"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.lineId} className="flex gap-4 border-b py-5">
                <Image
                  src={item.image}
                  alt=""
                  width={96}
                  height={120}
                  className="h-28 w-20 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    onClick={() => setOpen(false)}
                    href={`/product/${item.slug}`}
                    className="font-display text-xl font-semibold text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatPrice(item.unitPrice)}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        onClick={() => update(item.lineId, item.quantity - 1)}
                        aria-label={`Decrease ${item.name} quantity`}
                        className="size-8"
                      >
                        <Minus className="mx-auto size-3" />
                      </button>
                      <span className="min-w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => update(item.lineId, item.quantity + 1)}
                        aria-label={`Increase ${item.name} quantity`}
                        className="size-8"
                      >
                        <Plus className="mx-auto size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.lineId)}
                      aria-label={`Remove ${item.name}`}
                      className="size-9 text-muted-foreground"
                    >
                      <Trash2 className="mx-auto size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <ShoppingBag className="mx-auto size-8 text-aurevia-gold" />
                <p className="mt-4 font-display text-3xl text-primary">
                  Your bag is empty.
                </p>
                <Button asChild className="mt-5" onClick={() => setOpen(false)}>
                  <Link href="/shop">Discover Fragrances</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="border-t">
            <div className="mb-2 flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal(items))}</span>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/cart">View Bag</Link>
            </Button>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/checkout">Checkout</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
