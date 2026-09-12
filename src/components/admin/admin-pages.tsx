"use client";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/data/products";
import {
  inventoryStatus,
  useAdminStore,
  type AdminProduct,
  type Promotion,
} from "@/store/admin-store";
import { useOrderStore } from "@/store/order-store";
const Head = ({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p className="text-eyebrow text-aurevia-gold">{eyebrow}</p>
      <h1 className="mt-2 font-display text-5xl text-primary">{title}</h1>
    </div>
    {action}
  </div>
);
const Status = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex border border-aurevia-gold/50 bg-aurevia-cream px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
    {children}
  </span>
);
export function Dashboard() {
  const localProducts = useAdminStore((s) => s.products),
    [products, setProducts] = useState<AdminProduct[]>(localProducts),
    orders = useOrderStore((s) => s.orders),
    variants = products.flatMap((p) => p.variants),
    revenue = orders.reduce((n, o) => n + o.total, 0),
    customers = new Set(orders.map((o) => o.customer.email)).size,
    low = variants.filter((v) => inventoryStatus(v) === "Low Stock"),
    out = variants.filter((v) => v.stock === 0);
  useEffect(() => { let mounted = true; void fetch("/api/admin/products").then((response) => response.ok ? response.json() : []).then((data: AdminProduct[]) => { if (mounted) setProducts(data); }); return () => { mounted = false; }; }, []);
  const metrics: { Icon: LucideIcon; label: string; value: string | number }[] = [
    { Icon: Package, label: "Products", value: products.length },
    { Icon: ShoppingBag, label: "New Orders", value: orders.filter(o=>o.orderStatus==="confirmed").length },
    { Icon: ShoppingBag, label: "Processing", value: orders.filter(o=>o.orderStatus==="processing").length },
    { Icon: ShoppingBag, label: "Shipped", value: orders.filter(o=>o.orderStatus==="shipped").length },
    { Icon: ShoppingBag, label: "Delivered", value: orders.filter(o=>o.orderStatus==="delivered").length },
    { Icon: ArrowRight, label: "Revenue", value: formatPrice(revenue) },
    { Icon: Users, label: "Customers", value: customers },
    { Icon: AlertTriangle, label: "Low Stock", value: low.length },
    { Icon: Boxes, label: "Out of Stock", value: out.length },
  ];
  return (
    <div>
      <Head
        eyebrow="Operations"
        title="Dashboard"
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus />
              Add Product
            </Link>
          </Button>
        }
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ Icon, label, value }) => (
          <div key={label} className="border bg-white p-5">
            <Icon className="size-5 text-aurevia-gold" />
            <p className="mt-5 text-sm text-muted-foreground">
              {label}
            </p>
            <strong className="mt-1 block font-display text-3xl text-primary">
              {String(value)}
            </strong>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl text-primary">Recent Orders</h2>
          <div className="mt-4 overflow-x-auto border">
            {orders.length ? (
              <table className="w-full min-w-[36rem] text-sm">
                <thead className="bg-aurevia-cream text-left">
                  <tr>
                    <th className="p-3">Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="p-3">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="font-semibold underline"
                        >
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td>{o.customer.email}</td>
                      <td>{formatPrice(o.total)}</td>
                      <td>
                        <Status>{o.orderStatus}</Status>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty text="No orders have been placed yet." />
            )}
          </div>
        </section>
        <section>
          <h2 className="font-display text-3xl text-primary">Low Stock</h2>
          <div className="mt-4 border">
            {low.length ? (
              low.slice(0, 6).map((v) => {
                const p = products.find((x) =>
                  x.variants.some((y) => y.id === v.id),
                )!;
                return (
                  <div
                    key={v.id}
                    className="flex justify-between border-b p-4 last:border-0"
                  >
                    <span>
                      {p.name} · {v.volume}
                    </span>
                    <strong>{v.stock} left</strong>
                  </div>
                );
              })
            ) : (
              <Empty text="Inventory looks healthy." />
            )}
          </div>
        </section>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/admin/inventory">Manage Inventory</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/orders">View Orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/promotions">Create Promotion</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/home">View Store</Link>
        </Button>
      </div>
    </div>
  );
}
export function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([]),
    [query, setQuery] = useState(""),
    [family, setFamily] = useState("All"),
    [target, setTarget] = useState<{ id: string; name: string } | null>(null),
    list = products
      .filter(
        (p) =>
          (family === "All" || p.family === family) &&
          `${p.name} ${p.slug}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
  const reload = async () => {
    const response = await fetch("/api/admin/products");
    if (response.ok) setProducts(await response.json() as AdminProduct[]);
  };
  useEffect(() => { let mounted = true; void fetch("/api/admin/products").then((response) => response.ok ? response.json() : []).then((data: AdminProduct[]) => { if (mounted) setProducts(data); }); return () => { mounted = false; }; }, []);
  async function duplicate(id: string) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const response = await fetch("/api/admin/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, name: `${product.name} Copy`, slug: `${product.slug}-copy`, status: "Draft", variants: product.variants.map((variant) => ({ ...variant, id: undefined, sku: `${variant.sku}-COPY` })) }),
    });
    if (response.ok) await reload();
  }
  async function archive(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (response.ok) await reload();
  }
  return (
    <div>
      <Head
        eyebrow="Catalog"
        title="Products"
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus />
              Add Product
            </Link>
          </Button>
        }
      />
      <div className="mt-7 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          className="h-11 border bg-white px-3"
        >
          <option>All</option>
          {[...new Set(products.map((p) => p.family))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 overflow-x-auto border">
        {list.length ? (
          <table className="w-full min-w-[65rem] text-sm">
            <thead className="bg-aurevia-cream text-left">
              <tr>
                {[
                  "Product",
                  "Family",
                  "Concentration",
                  "Variants",
                  "Price Range",
                  "Stock",
                  "Status",
                  "Featured",
                  "Actions",
                ].map((x) => (
                  <th key={x} className="p-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const prices = p.variants.map((v) => v.price),
                  stock = p.variants.reduce((n, v) => n + v.stock, 0);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="flex items-center gap-3 p-3">
                      <Image
                        src={p.images.catalog}
                        alt={`${p.name} product`}
                        width={48}
                        height={56}
                        className="h-14 w-12 object-cover"
                      />
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.family}</td>
                    <td>{p.concentration}</td>
                    <td>
                      <div className="flex max-w-64 flex-wrap gap-1">
                        {p.variants
                          .filter((variant) => variant.active)
                          .map((variant) => (
                            <span
                              key={variant.id}
                              className="border bg-aurevia-cream px-2 py-1 text-xs"
                            >
                              {variant.volume}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td>
                      {formatPrice(Math.min(...prices))}–
                      {formatPrice(Math.max(...prices))}
                    </td>
                    <td>{stock}</td>
                    <td>
                      <Status>{stock === 0 ? "Out of Stock" : p.status}</Status>
                    </td>
                    <td>{p.featured ? "Yes" : "No"}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/products/${p.id}`}>Edit</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void duplicate(p.id)}
                        >
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTarget({ id: p.id, name: p.name })}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty text="No products match your search." />
        )}
      </div>
      <Dialog
        open={Boolean(target)}
        onOpenChange={(o) => !o && setTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {target?.name}?</DialogTitle>
            <DialogDescription>
              This archives the product from the live storefront. Existing order
              records are retained.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (target) void archive(target.id);
                setTarget(null);
              }}
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function InventoryAdmin() {
  const products = useAdminStore((s) => s.products),
    adjust = useAdminStore((s) => s.adjustStock),
    events = useAdminStore((s) => s.events),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [target, setTarget] = useState<{
      productId: string;
      variantId: string;
      label: string;
      stock: number;
    } | null>(null),
    [amount, setAmount] = useState(0),
    [reason, setReason] = useState("Restock"),
    rows = products
      .flatMap((p) =>
        p.variants.map((v) => ({ p, v, status: inventoryStatus(v) })),
      )
      .filter(
        (x) =>
          (filter === "All" || x.status === filter) &&
          `${x.p.name} ${x.v.sku}`.toLowerCase().includes(query.toLowerCase()),
      );
  return (
    <div>
      <Head eyebrow="Variant-level control" title="Inventory" />
      <div className="mt-7 flex flex-wrap gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product or SKU"
          className="max-w-md"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 border bg-white px-3"
        >
          {["All", "In Stock", "Low Stock", "Out of Stock"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 overflow-x-auto border">
        <table className="w-full min-w-[55rem] text-sm">
          <thead className="bg-aurevia-cream text-left">
            <tr>
              {[
                "Product",
                "Variant",
                "SKU",
                "Price",
                "Stock",
                "Threshold",
                "Status",
                "Actions",
              ].map((x) => (
                <th key={x} className="p-3">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, v, status }) => (
              <tr key={v.id} className="border-t">
                <td className="p-3 font-semibold">{p.name}</td>
                <td>{v.volume}</td>
                <td>{v.sku}</td>
                <td>{formatPrice(v.price)}</td>
                <td>{v.stock}</td>
                <td>{v.lowStockThreshold}</td>
                <td>
                  <Status>{status}</Status>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTarget({
                        productId: p.id,
                        variantId: v.id,
                        label: `${p.name} · ${v.volume}`,
                        stock: v.stock,
                      });
                      setAmount(0);
                    }}
                  >
                    Adjust
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-10 font-display text-3xl text-primary">
        Recent Adjustments
      </h2>
      <div className="mt-4 border">
        {events.length ? (
          events.slice(0, 8).map((e) => (
            <div
              key={e.id}
              className="grid gap-2 border-b p-4 text-sm sm:grid-cols-4"
            >
              <span>{e.reason}</span>
              <span>
                {e.previousStock} → {e.newStock}
              </span>
              <span>
                {e.adjustment > 0 ? `+${e.adjustment}` : e.adjustment}
              </span>
              <time>{new Date(e.createdAt).toLocaleString()}</time>
            </div>
          ))
        ) : (
          <Empty text="No inventory adjustments yet." />
        )}
      </div>
      <Dialog
        open={Boolean(target)}
        onOpenChange={(o) => !o && setTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust {target?.label}</DialogTitle>
            <DialogDescription>
              Current stock: {target?.stock}. Final stock cannot be below zero.
            </DialogDescription>
          </DialogHeader>
          <label>
            Adjustment
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2"
            />
          </label>
          <label>
            Reason
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 h-11 w-full border bg-white px-3"
            >
              {[
                "Restock",
                "Damaged",
                "Returned",
                "Manual Correction",
                "Other",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <p className="text-sm">
            New stock: {Math.max(0, (target?.stock ?? 0) + amount)}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              disabled={!target || amount === 0 || target.stock + amount < 0}
              onClick={() => {
                if (
                  target &&
                  adjust(target.productId, target.variantId, amount, reason)
                )
                  setTarget(null);
              }}
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function OrdersAdmin() {
  const orders = useOrderStore((s) => s.orders),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    list = orders.filter(
      (o) =>
        (filter === "All" || o.orderStatus === filter) &&
        `${o.orderNumber} ${o.customer.email} ${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  return (
    <div>
      <Head eyebrow="Fulfilment" title="Orders" />
      <div className="mt-7 flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order or customer"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 border bg-white px-3"
        >
          <option>All</option>
          {[
            "confirmed",
            "processing",
            "shipped",
            "out-for-delivery",
            "delivered",
            "cancelled",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 overflow-x-auto border">
        {list.length ? (
          <table className="w-full min-w-[55rem] text-sm">
            <thead className="bg-aurevia-cream text-left">
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Date",
                  "Items",
                  "Total",
                  "Payment",
                  "Fulfilment",
                  "Actions",
                ].map((x) => (
                  <th key={x} className="p-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-semibold">{o.orderNumber}</td>
                  <td>{o.customer.email}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>{o.paymentStatus}</td>
                  <td>
                    <Status>{o.orderStatus}</Status>
                  </td>
                  <td>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/orders/${o.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty text="No orders have been placed yet." />
        )}
      </div>
    </div>
  );
}
export function OrderAdminDetail({ id }: { id: string }) {
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id)),
    accept = useOrderStore((s) => s.accept),
    ship = useOrderStore((s) => s.ship),
    cancel = useOrderStore((s) => s.cancel);
  if (!order) return <Empty text="Order not found." />;
  return (
    <div>
      <Head eyebrow="Order details" title={order.orderNumber} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section>
          {order.items.map((i) => (
            <div key={i.lineId} className="flex gap-4 border-t py-4">
              <Image src={i.image} alt={`Aurévia ${i.name} Eau de Parfum bottle`} width={64} height={80} className="h-20 w-16 object-cover"/>
              <span className="flex-1">
                {i.name}
                <small className="block text-muted-foreground">
                  {i.size} · Qty {i.quantity}
                </small>
              </span>
              <strong>{formatPrice(i.unitPrice * i.quantity)}</strong>
            </div>
          ))}
          <div className="mt-8 bg-aurevia-cream p-5">
            <h2 className="font-display text-2xl text-primary">
              Customer & delivery
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.customer.email} · {order.customer.phone}
              <br />
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.state}, {order.shippingAddress.country}
              <br />
              {order.deliveryMethod.name} · {order.deliveryMethod.estimate}
            </p>
          </div>
        </section>
        <aside className="border p-5">
          <h2 className="font-display text-2xl text-primary">Order total</h2>
          <p className="mt-4 text-3xl font-semibold">
            {formatPrice(order.total)}
          </p>
          <Status>{order.orderStatus}</Status>
          <p className="mt-3 text-sm text-muted-foreground">{order.orderStatus==="confirmed"?"Awaiting acceptance":order.orderStatus==="processing"?"Preparing for shipment":order.orderStatus==="shipped"?"Demo delivery simulation active":order.orderStatus==="delivered"?"Fulfilled":"No further fulfilment actions"}</p>
          <div className="mt-6 grid gap-3">
            {order.orderStatus==="confirmed"&&<Button onClick={()=>{if(window.confirm("Accept this order?"))accept(order.id)}}>Accept Order</Button>}
            {order.orderStatus==="processing"&&<Button onClick={()=>{if(window.confirm("Ship this order and begin the 10-second demo delivery simulation?"))ship(order.id)}}>Ship Order</Button>}
            {["confirmed","processing"].includes(order.orderStatus)&&<Button variant="outline" onClick={()=>{if(window.confirm("Cancel this order?"))cancel(order.id)}}>Cancel Order</Button>}
          </div>
          <ol className="mt-8 space-y-4 border-t pt-5 text-sm">
            {[["Order Placed",order.timeline.confirmedAt],["Order Accepted",order.timeline.processingAt],["Shipped",order.timeline.shippedAt],["Delivered",order.timeline.deliveredAt]].map(([label,at])=><li key={label} className={at?"text-primary":"text-muted-foreground"}><strong className="block">{label}</strong><span>{at?new Date(at).toLocaleString():"Pending"}</span></li>)}
          </ol>
        </aside>
      </div>
    </div>
  );
}
export function CustomersAdmin() {
  const orders = useOrderStore((s) => s.orders),
    customers = useMemo(
      () =>
        [...new Set(orders.map((o) => o.customer.email))].map((email) => {
          const own = orders.filter((o) => o.customer.email === email);
          return {
            id: encodeURIComponent(email),
            email,
            orders: own.length,
            spend: own.reduce((n, o) => n + o.total, 0),
            last: own[0]?.createdAt,
          };
        }),
      [orders],
    );
  return (
    <div>
      <Head eyebrow="Customer care" title="Customers" />
      <div className="mt-7 overflow-x-auto border">
        {customers.length ? (
          <table className="w-full min-w-[42rem] text-sm">
            <thead className="bg-aurevia-cream text-left">
              <tr>
                {[
                  "Customer",
                  "Email",
                  "Orders",
                  "Total Spend",
                  "Last Order",
                  "Status",
                ].map((x) => (
                  <th key={x} className="p-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} className="border-t">
                  <td className="p-3">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="font-semibold underline"
                    >
                      {c.email.split("@")[0]}
                    </Link>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.orders}</td>
                  <td>{formatPrice(c.spend)}</td>
                  <td>
                    {c.last ? new Date(c.last).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <Status>Active</Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty text="No customer order records yet." />
        )}
      </div>
    </div>
  );
}
export function CustomerDetail({ id }: { id: string }) {
  const email = decodeURIComponent(id),
    orders = useOrderStore((s) =>
      s.orders.filter((o) => o.customer.email === email),
    );
  return (
    <div>
      <Head eyebrow="Customer" title={email} />
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <Metric label="Total Orders" value={orders.length} />
        <Metric
          label="Total Spend"
          value={formatPrice(orders.reduce((n, o) => n + o.total, 0))}
        />
        <Metric
          label="Last Order"
          value={
            orders[0] ? new Date(orders[0].createdAt).toLocaleDateString() : "—"
          }
        />
      </div>
      <h2 className="mt-10 font-display text-3xl text-primary">
        Order History
      </h2>
      <div className="mt-4 border">
        {orders.length ? (
          orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex justify-between border-b p-4"
            >
              <span>{o.orderNumber}</span>
              <strong>{formatPrice(o.total)}</strong>
            </Link>
          ))
        ) : (
          <Empty text="No orders for this customer." />
        )}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Passwords, card numbers and authentication secrets are never shown here.
      </p>
    </div>
  );
}
export function CollectionsAdmin() {
  return (
    <div>
      <Head eyebrow="Merchandising" title="Collections removed" />
      <p className="mt-5 max-w-xl text-muted-foreground">
        Products remain unchanged. Collection browsing and assignment controls
        are no longer shown in the storefront or admin.
      </p>
    </div>
  );
}
export function PromotionsAdmin() {
  const promos = useAdminStore((s) => s.promotions),
    save = useAdminStore((s) => s.savePromotion),
    [code, setCode] = useState(""),
    [value,setValue]=useState(10),
    [minimum,setMinimum]=useState(0),
    [limit,setLimit]=useState(100),
    [start,setStart]=useState("2026-08-28"),
    [end,setEnd]=useState("2027-08-28");
  function create() {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    const promotion: Promotion = {
      id: crypto.randomUUID(),
      code: clean,
      description: "Development promotion",
      type: "percentage",
      value,
      minimumOrder:minimum||undefined,
      usageLimit:limit||undefined,
      startDate:start,
      endDate:end,
      status: "Active",
    };
    save(promotion);
    setCode("");
  }
  return (
    <div>
      <Head eyebrow="Offers" title="Promotions" />
      <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promotion code"
        />
        <Input aria-label="Discount percentage" type="number" min={1} max={100} value={value} onChange={e=>setValue(Number(e.target.value))}/>
        <Input aria-label="Minimum order" type="number" min={0} value={minimum} onChange={e=>setMinimum(Number(e.target.value))}/>
        <Input aria-label="Usage limit" type="number" min={0} value={limit} onChange={e=>setLimit(Number(e.target.value))}/>
        <Input aria-label="Start date" type="date" value={start} onChange={e=>setStart(e.target.value)}/>
        <Input aria-label="End date" type="date" value={end} onChange={e=>setEnd(e.target.value)}/>
        <Button onClick={create}>Create Promotion</Button>
      </div>
      <div className="mt-7 border">
        {promos.map((p) => (
          <div key={p.id} className="grid gap-2 border-b p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <strong>{p.code}</strong>
            <span>{p.description}</span>
            <span>
              {p.value}
              {p.type === "percentage" ? "%" : ` ${formatPrice(p.value)}`}
            </span>
            <div className="flex items-center gap-2"><Status>{p.status}</Status><Button size="sm" variant="outline" onClick={()=>save({...p,status:p.status==="Active"?"Inactive":"Active"})}>{p.status==="Active"?"Deactivate":"Activate"}</Button><Button size="sm" variant="ghost" onClick={()=>{const next=window.prompt("Discount percentage",String(p.value));if(next)save({...p,value:Math.max(1,Math.min(100,Number(next)))})}}>Edit</Button></div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Active promotions are validated against dates, minimum order and discount value by the cart and checkout. Phase 10 will move validation and usage counting to the server.
      </p>
    </div>
  );
}
export function SettingsAdmin() {
  const settings = useAdminStore((s) => s.settings),
    update = useAdminStore((s) => s.updateSettings),
    [draft, setDraft] = useState(settings),
    [saved, setSaved] = useState(false);
  return (
    <div>
      <Head eyebrow="Configuration" title="Settings" />
      <div className="mt-8 max-w-2xl space-y-6">
        <label className="block">
          Store name
          <Input
            value={draft.storeName}
            onChange={(e) => setDraft({ ...draft, storeName: e.target.value })}
            className="mt-2"
          />
        </label>
        <label className="block">
          Currency
          <Input value={draft.currency} disabled className="mt-2" />
        </label>
        <label className="block">
          Support email
          <Input
            value={draft.supportEmail}
            onChange={(e) =>
              setDraft({ ...draft, supportEmail: e.target.value })
            }
            className="mt-2"
          />
        </label>
        <label className="block">
          Default low-stock threshold
          <Input
            type="number"
            min={0}
            value={draft.defaultLowStockThreshold}
            onChange={(e) =>
              setDraft({
                ...draft,
                defaultLowStockThreshold: Math.max(0, Number(e.target.value)),
              })
            }
            className="mt-2"
          />
        </label>
        <Button
          onClick={() => {
            update(draft);
            setSaved(true);
          }}
        >
          Save Settings
        </Button>
        {saved && (
          <p role="status" className="text-sm text-success">
            Settings saved in development storage.
          </p>
        )}
      </div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-muted-foreground">{text}</div>;
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border bg-white p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <strong className="mt-2 block font-display text-3xl text-primary">
        {value}
      </strong>
    </div>
  );
}
