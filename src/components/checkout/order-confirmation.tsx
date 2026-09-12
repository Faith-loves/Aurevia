"use client";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/products";
import { useOrderStore } from "@/store/order-store";
import { useAccountStore } from "@/store/account-store";
export function OrderConfirmation({ id }: { id: string }) {
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const authenticated = useAccountStore((s) => s.isAuthenticated);
  if (!order)
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-center">
        <div>
          <p className="text-eyebrow text-aurevia-gold">Order lookup</p>
          <h1 className="text-display mt-3 text-primary">
            We couldn&apos;t find that order.
          </h1>
          <div className="mt-7 flex justify-center gap-3">
            <Button asChild>
              <Link href="/home">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shop">Shop Fragrances</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-4xl py-12 lg:py-20">
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-aurevia-gold text-aurevia-plum">
          <Check />
        </div>
        <p className="text-eyebrow mt-6 text-aurevia-gold">Order confirmed</p>
        <h1 className="text-display mt-3 text-primary">
          Your fragrance is on its way.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Thank you for shopping with Aurévia. We&apos;ve received your order
          and will keep you updated as it makes its way to you.
        </p>
        <p className="mt-5 font-semibold">Order #{order.orderNumber}</p>
      </div>
      <div className="mt-12 grid gap-8 bg-aurevia-cream p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-primary">Order details</h2>
          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div key={item.lineId} className="flex gap-3">
                <Image
                  src={item.image}
                  alt=""
                  width={64}
                  height={80}
                  className="h-20 w-16 object-cover"
                />
                <div className="flex-1">
                  <strong className="font-display text-lg text-primary">
                    {item.name}
                  </strong>
                  <p className="text-xs text-muted-foreground">
                    {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-6 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>−{formatPrice(order.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatPrice(order.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="font-display text-3xl text-primary">Delivery</h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.address}
            {order.shippingAddress.apartment
              ? `, ${order.shippingAddress.apartment}`
              : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}
            <br />
            {order.shippingAddress.country}
          </p>
          <p className="mt-5 text-sm">
            <strong>{order.deliveryMethod.name}</strong>
            <br />
            <span className="text-muted-foreground">
              {order.deliveryMethod.estimate}
            </span>
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            Updates will be sent to {order.customer.email}
          </p>
        </div>
      </div>
      <div className="mt-10 text-center">
        <Button asChild size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        {authenticated ? (
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild variant="outline"><Link href={`/account/orders/${order.id}`}>View My Order</Link></Button>
            <Button asChild variant="ghost"><Link href={`/account/orders/${order.id}/tracking`}>Track Order</Link></Button>
          </div>
        ) : <div className="mx-auto mt-12 max-w-xl border-t pt-8">
          <h2 className="font-display text-3xl text-primary">
            Save your order to an Aurévia account
          </h2>
          <p className="mt-3 text-muted-foreground">
            Create an account to keep your order history, save your favorites,
            and make your next checkout faster.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/create-account">Create Account</Link>
          </Button>
        </div>}
      </div>
    </div>
  );
}
