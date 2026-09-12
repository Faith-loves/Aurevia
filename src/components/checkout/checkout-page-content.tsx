"use client";
/* eslint-disable react-hooks/incompatible-library -- React Hook Form watch is intentionally used for checkout persistence. */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/data/products";
import { nigerianStates, shippingMethods } from "@/lib/checkout";
import {
  checkoutSchema,
  type CheckoutValues,
} from "@/lib/validations/checkout";
import { cartDiscount, cartSubtotal, useCartStore } from "@/store/cart-store";
const PROGRESS_KEY = "aurevia-checkout-progress";
const steps = ["Information", "Delivery", "Payment", "Review"];
function ErrorText({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1 text-sm text-destructive">
      {message}
    </p>
  ) : null;
}
export function CheckoutPageContent() {
  const items = useCartStore((s) => s.items),
    promo = useCartStore((s) => s.promo),
    clearCart = useCartStore((s) => s.clearCart),
    [step, setStep] = useState(0),
    [summaryOpen, setSummaryOpen] = useState(false),
    [processing, setProcessing] = useState(false),
    [paymentError, setPaymentError] = useState("");
  const {
    register,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      contactPhone: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      deliveryMethod: "standard",
      paymentMethod: "paystack",
    },
  });
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PROGRESS_KEY);
      if (saved) reset(JSON.parse(saved));
    } catch {}
  }, [reset]);
  useEffect(() => {
    const subscription = watch((values) =>
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(values)),
    );
    return () => subscription.unsubscribe();
  }, [watch]);
  const values = watch(),
    shipping =
      shippingMethods.find((s) => s.id === values.deliveryMethod) ??
      shippingMethods[0],
    subtotal = cartSubtotal(items),
    discount = cartDiscount(items, promo),
    total = subtotal - discount + shipping.fee;
  async function next() {
    const fields: Record<number, (keyof CheckoutValues)[]> = {
      0: ["email", "contactPhone"],
      1: ["firstName", "lastName", "address", "city", "state", "country"],
      2: ["deliveryMethod", "paymentMethod"],
    };
    if (await trigger(fields[step] ?? [])) setStep(Math.min(3, step + 1));
  }
  async function placeOrder() {
    if (!(await trigger())) return;
    setPaymentError("");
    setProcessing(true);
    const v = getValues();
    if (items.some((item) => !item.variantId)) {
      setProcessing(false);
      setPaymentError("Please refresh your bag and add each perfume again before checking out.");
      return;
    }
    try {
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: v.email, contactPhone: v.contactPhone, firstName: v.firstName, lastName: v.lastName,
          line1: v.address, line2: v.apartment || undefined, city: v.city, state: v.state, country: v.country,
          postalCode: v.postalCode || undefined, deliveryMethod: v.deliveryMethod, promotionCode: promo ?? undefined,
          items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
        }),
      });
      const data = await response.json().catch(() => null) as { authorizationUrl?: string; error?: string } | null;
      if (!response.ok || !data?.authorizationUrl) throw new Error(data?.error ?? "We couldn't initialize payment.");
      clearCart();
      sessionStorage.removeItem(PROGRESS_KEY);
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      setProcessing(false);
      setPaymentError(error instanceof Error ? error.message : "We couldn't initialize payment. Please try again.");
    }
  }
  if (!items.length)
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <ShoppingBag className="mx-auto size-9 text-aurevia-gold" />
          <h1 className="text-display mt-5 text-primary">Your bag is empty.</h1>
          <Button asChild className="mt-7">
            <Link href="/shop">Explore Fragrances</Link>
          </Button>
        </div>
      </div>
    );
  const summary = (
    <div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.lineId} className="flex gap-3">
            <Image
              src={item.image}
              alt=""
              width={72}
              height={88}
              className="h-20 w-16 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold text-primary">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.size} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <dl className="mt-6 space-y-3 border-t pt-5 text-sm">
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
          <dd>{formatPrice(shipping.fee)}</dd>
        </div>
        <div className="flex justify-between border-t pt-4 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );
  return (
    <div>
      <div className="mb-10 flex items-center justify-between gap-4">
        <Link href="/cart" className="text-sm font-semibold text-primary">
          ← Back to Bag
        </Link>
        <Link
          href="/home"
          className="font-display text-2xl font-semibold tracking-[.12em] text-primary"
        >
          AURÉVIA
        </Link>
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <LockKeyhole className="size-3" />
          Secure Checkout
        </span>
      </div>
      <button
        onClick={() => setSummaryOpen((v) => !v)}
        className="mb-8 flex w-full items-center justify-between border-y py-4 font-semibold lg:hidden"
      >
        Show order summary {summaryOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      {summaryOpen && (
        <div className="mb-10 bg-aurevia-cream p-5 lg:hidden">{summary}</div>
      )}
      <div className="grid gap-14 lg:grid-cols-[1fr_23rem]">
        <section>
          <ol
            className="mb-10 grid grid-cols-4 gap-2"
            aria-label="Checkout progress"
          >
            {steps.map((name, i) => (
              <li
                key={name}
                className={`border-t-2 pt-2 text-xs ${i <= step ? "border-aurevia-plum text-primary" : "border-border text-muted-foreground"}`}
              >
                {i < step && <Check className="mr-1 inline size-3" />}
                {name}
              </li>
            ))}
          </ol>
          {step === 0 && (
            <div>
              <p className="text-eyebrow text-aurevia-gold">Step 1</p>
              <h1 className="text-heading-1 mt-2 text-primary">
                Contact information
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-primary underline"
                >
                  Sign in
                </Link>
              </p>
              <div className="mt-8 grid gap-5">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="mt-2"
                    {...register("email")}
                  />
                  <ErrorText message={errors.email?.message} />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone number</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    autoComplete="tel"
                    className="mt-2"
                    {...register("contactPhone")}
                  />
                  <ErrorText message={errors.contactPhone?.message} />
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <p className="text-eyebrow text-aurevia-gold">Step 2</p>
              <h1 className="text-heading-1 mt-2 text-primary">
                Delivery address
              </h1>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  ["firstName", "First name", "given-name"],
                  ["lastName", "Last name", "family-name"],
                ].map(([id, label, ac]) => (
                  <div key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      autoComplete={ac}
                      className="mt-2"
                      {...register(id as "firstName" | "lastName")}
                    />
                    <ErrorText
                      message={errors[id as "firstName" | "lastName"]?.message}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    className="mt-2"
                    {...register("address")}
                  />
                  <ErrorText message={errors.address?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="apartment">
                    Apartment / Suite (optional)
                  </Label>
                  <Input
                    id="apartment"
                    className="mt-2"
                    {...register("apartment")}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    autoComplete="address-level2"
                    className="mt-2"
                    {...register("city")}
                  />
                  <ErrorText message={errors.city?.message} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    autoComplete="address-level1"
                    className="mt-2 h-11 w-full rounded-md border bg-white px-3"
                    {...register("state")}
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <ErrorText message={errors.state?.message} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    autoComplete="country-name"
                    className="mt-2 h-11 w-full rounded-md border bg-white px-3"
                    {...register("country")}
                  >
                    <option>Nigeria</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal code (optional)</Label>
                  <Input
                    id="postalCode"
                    autoComplete="postal-code"
                    className="mt-2"
                    {...register("postalCode")}
                  />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <p className="text-eyebrow text-aurevia-gold">Step 3</p>
              <h1 className="text-heading-1 mt-2 text-primary">
                Delivery & payment
              </h1>
              <fieldset className="mt-8">
                <legend className="font-display text-2xl text-primary">
                  Delivery method
                </legend>
                <div className="mt-4 grid gap-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 border p-4 ${values.deliveryMethod === method.id ? "border-aurevia-plum" : ""}`}
                    >
                      <input
                        type="radio"
                        value={method.id}
                        {...register("deliveryMethod")}
                      />
                      <span className="flex-1">
                        <strong>{method.name}</strong>
                        <span className="block text-sm text-muted-foreground">
                          {method.estimate}
                        </span>
                      </span>
                      <strong>{formatPrice(method.fee)}</strong>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-9">
                <legend className="font-display text-2xl text-primary">
                  Payment method
                </legend>
                <p className="mt-2 text-sm text-muted-foreground">Payments are completed securely on Paystack. We never collect card details here.</p>
                <div className="mt-4 grid gap-3">
                  <label
                    className={`flex cursor-pointer gap-3 border p-4 ${values.paymentMethod === "paystack" ? "border-aurevia-plum" : ""}`}
                  >
                    <input
                      type="radio"
                      value="paystack"
                      {...register("paymentMethod")}
                    />
                    <span>
                      <strong>Card / Paystack</strong>
                      <span className="block text-sm text-muted-foreground">
                        Continue securely with Paystack.
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            </div>
          )}
          {step === 3 && (
            <div>
              <p className="text-eyebrow text-aurevia-gold">Final step</p>
              <h1 className="text-heading-1 mt-2 text-primary">
                Review your order
              </h1>
              <div className="mt-8 divide-y border-y">
                {[
                  ["Contact", `${values.email} · ${values.contactPhone}`, 0],
                  [
                    "Delivery",
                    `${values.firstName} ${values.lastName}, ${values.address}, ${values.city}, ${values.state}`,
                    1,
                  ],
                  [
                    "Delivery Method",
                    `${shipping.name} · ${shipping.estimate}`,
                    2,
                  ],
                  [
                    "Payment",
                    values.paymentMethod === "paystack"
                      ? "Card / Paystack"
                      : "Paystack",
                    2,
                  ],
                ].map(([title, copy, target]) => (
                  <div key={String(title)} className="flex gap-5 py-5">
                    <div className="flex-1">
                      <h2 className="font-semibold">{String(title)}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {String(copy)}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(Number(target))}
                      className="text-sm font-semibold text-primary underline"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
              {paymentError && (
                <div
                  role="alert"
                  className="mt-7 border border-destructive/30 bg-destructive/5 p-5"
                >
                  <h2 className="font-display text-2xl text-primary">
                    Checkout couldn&apos;t be started.
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No payment has been taken. {paymentError}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaymentError("");
                      }}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPaymentError("");
                        setStep(2);
                      }}
                    >
                      Choose Another Method
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button disabled={processing} onClick={placeOrder} size="lg">
                {processing && (
                  <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                )}
                {processing ? "Processing your order…" : "Place Order"}
              </Button>
            )}
          </div>
          {processing && (
            <p
              aria-live="assertive"
              className="mt-3 text-right text-sm text-muted-foreground"
            >
              Please don&apos;t close this page.
            </p>
          )}
          <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
            By placing an order you agree to the{" "}
            <Link href="/terms" className="underline">Terms</Link> and acknowledge the{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>. Review{" "}
            <Link href="/shipping" className="underline">Shipping</Link> and{" "}
            <Link href="/returns" className="underline">Returns</Link> before checkout.
          </p>
        </section>
        <aside className="hidden h-fit bg-aurevia-cream p-6 lg:sticky lg:top-8 lg:block">
          <h2 className="font-display text-3xl text-primary">Order Summary</h2>
          <div className="mt-6">{summary}</div>
        </aside>
      </div>
    </div>
  );
}
