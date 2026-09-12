"use client";
import { Check, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice, products } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
const orderLabel = (status: string) =>
  status.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
export function OrdersList() {
  const orders = useOrderStore((s) => s.orders);
  if (!orders.length)
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-center">
        <div>
          <Package className="mx-auto size-8 text-aurevia-gold" />
          <h1 className="text-display mt-5 text-primary">No orders yet.</h1>
          <p className="mt-4 text-muted-foreground">
            When you find a fragrance you love, your orders will appear here.
          </p>
          <Button asChild className="mt-7">
            <Link href="/shop">Explore Fragrances</Link>
          </Button>
        </div>
      </div>
    );
  return (
    <div>
      <p className="text-eyebrow text-aurevia-gold">Purchase history</p>
      <h1 className="text-display mt-3 text-primary">Your Orders</h1>
      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border-t border-aurevia-gold bg-aurevia-cream p-6"
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {order.orderNumber}
                </p>
                <h2 className="mt-2 font-display text-2xl text-primary">
                  {orderLabel(order.orderStatus)}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-NG", {
                    dateStyle: "medium",
                  }).format(new Date(order.createdAt))}{" "}
                  · {order.items.reduce((n, i) => n + i.quantity, 0)} items
                </p>
              </div>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div className="mt-5 flex items-end justify-between gap-5">
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => (
                  <Image
                    key={item.lineId}
                    src={item.image}
                    alt=""
                    width={64}
                    height={80}
                    className="h-20 w-16 border-2 border-aurevia-cream object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <Button asChild variant="outline">
                  <Link href={`/account/orders/${order.id}`}>View Order</Link>
                </Button>
                <Button asChild>
                  <Link href={`/account/orders/${order.id}/tracking`}>
                    Track Order
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
export function OrderDetail({ id }: { id: string }) {
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id)),
    add = useCartStore((s) => s.addItem),
    router = useRouter();
  if (!order) return <Missing />;
  function buyAgain() {
    for (const item of order!.items) {
      const product = products.find((p) => p.id === item.productId),
        size = product?.sizes.find((s) => s.volume === item.size && s.inStock);
      if (product && size)
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          family: product.fragranceFamily,
          size: size.volume,
          unitPrice: size.price,
          quantity: item.quantity,
        });
    }
    router.push("/cart");
  }
  return (
    <div>
      <p className="text-eyebrow text-aurevia-gold">Order details</p>
      <h1 className="text-display mt-3 text-primary">{order.orderNumber}</h1>
      <p className="mt-3 text-muted-foreground">
        {orderLabel(order.orderStatus)} ·{" "}
        {new Intl.DateTimeFormat("en-NG", { dateStyle: "long" }).format(
          new Date(order.createdAt),
        )}
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          {order.items.map((item) => (
            <article key={item.lineId} className="flex gap-4 border-t py-5">
              <Image
                src={item.image}
                alt=""
                width={96}
                height={120}
                className="h-28 w-20 object-cover"
              />
              <div className="flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-2xl text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.size} · Qty {item.quantity}
                </p>
              </div>
              <strong>{formatPrice(item.unitPrice * item.quantity)}</strong>
            </article>
          ))}
        </div>
        <aside className="bg-aurevia-cream p-6">
          <h2 className="font-display text-2xl text-primary">Summary</h2>
          <dl className="mt-5 space-y-2 text-sm">
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
            <div className="flex justify-between border-t pt-3 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
      <section className="mt-10 grid gap-6 bg-aurevia-cream p-6 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-primary">
            Delivery address
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.address}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-primary">
            Contact & payment
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {order.customer.email}
            <br />
            {order.customer.phone}
            <br />
            {order.deliveryMethod.name}
            <br />
            Development payment confirmed
          </p>
        </div>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/account/orders/${order.id}/tracking`}>Track Order</Link>
        </Button>
        <Button variant="outline" onClick={buyAgain}>
          Buy Again
        </Button>
        <Button asChild variant="ghost">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/help/orders">Need Help?</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link
            href={`/contact?subject=order-help&order=${encodeURIComponent(order.orderNumber)}`}
          >
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
const stages = ["Order Confirmed","Processing","Shipped","Delivered"] as const;
export function OrderTracking({ id }: { id: string }) {
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  if (!order) return <Missing />;
  const statusIndex = Math.max(0,["confirmed","processing","shipped","delivered"].indexOf(order.orderStatus));
  const times=[order.timeline.confirmedAt,order.timeline.processingAt,order.timeline.shippedAt,order.timeline.deliveredAt];
  return (
    <div>
      <p className="text-eyebrow text-aurevia-gold">Order journey</p>
      <h1 className="text-display mt-3 text-primary">
        Your fragrance is on its way.
      </h1>
      <p className="mt-4 text-muted-foreground">
        {order.orderNumber} · Estimated {order.deliveryMethod.estimate}
      </p>
      <ol className="mt-12 max-w-2xl">
        {stages.map((stage, i) => (
          <li key={stage} className="relative flex gap-5 pb-10 last:pb-0">
            <div
              className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${i <= statusIndex && order.orderStatus !== "cancelled" ? "bg-aurevia-plum text-aurevia-ivory" : "bg-aurevia-cream text-muted-foreground"}`}
            >
              {i <= statusIndex && order.orderStatus !== "cancelled" ? <Check className="size-4" /> : i + 1}
            </div>
            {i < stages.length - 1 && (
              <span className="absolute left-[1.1rem] top-9 h-full w-px bg-border" />
            )}
            <div>
              <h2
                className={`font-display text-2xl ${i <= statusIndex && order.orderStatus !== "cancelled" ? "text-primary" : "text-muted-foreground"}`}
              >
                {stage}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {order.orderStatus === "cancelled" ? "This order has been cancelled." : times[i] ? new Date(times[i]!).toLocaleString() : "Pending"}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/account/orders/${id}`}>Back to Order</Link>
        </Button>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        <Truck className="mr-1 inline size-3" />
        Demo delivery simulation for portfolio testing. No courier GPS service is connected.
      </p>
    </div>
  );
}
function Missing() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-display text-primary">
        We couldn&apos;t find that order.
      </h1>
      <Button asChild className="mt-7">
        <Link href="/account/orders">View All Orders</Link>
      </Button>
    </div>
  );
}
