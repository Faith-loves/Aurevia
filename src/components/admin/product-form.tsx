"use client";
/* eslint-disable react-hooks/incompatible-library -- React Hook Form watch powers the editable slug field. */
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { families, products as catalog } from "@/data/products";
import type { AdminProduct } from "@/store/admin-store";
const variant = z.object({
  id: z.string(),
  volume: z.string().min(1),
  price: z.number().min(0),
  sku: z.string().min(2),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0),
  active: z.boolean(),
});
const schema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  subtitle: z.string().min(4),
  description: z.string().min(10),
  family: z.enum(families),
  concentration: z.enum(["Eau de Parfum", "Parfum", "Eau de Toilette"]),
  intensity: z.enum(["Light", "Moderate", "Strong"]),
  topNotes: z.string(),
  heartNotes: z.string(),
  baseNotes: z.string(),
  occasions: z.string(),
  collection: z.string(),
  status: z.enum(["Active", "Draft"]),
  featured: z.boolean(),
  newArrival: z.boolean(),
  bestSeller: z.boolean(),
  badge: z.string(),
  variants: z
    .array(variant)
    .min(1)
    .superRefine((items, ctx) => {
      const sizes = items.map((x) => x.volume.toLowerCase());
      if (new Set(sizes).size !== sizes.length)
        ctx.addIssue({
          code: "custom",
          message: "Variant sizes must be unique.",
        });
    }),
});
type Values = z.infer<typeof schema>;
const split = (v: string) =>
  v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
export function ProductAdminForm({ id }: { id?: string }) {
  const router = useRouter();
  const [existing, setExisting] = useState<AdminProduct | undefined>();
  const [saveError, setSaveError] = useState("");
  const fallback = catalog[0];
  const form = useForm<Values>({
      resolver: zodResolver(schema),
      defaultValues: {
            name: "",
            slug: "",
            subtitle: "",
            description: "",
            family: "Floral",
            concentration: "Eau de Parfum",
            intensity: "Moderate",
            topNotes: "",
            heartNotes: "",
            baseNotes: "",
            occasions: "Everyday Ease",
            collection: "",
            status: "Draft",
            featured: false,
            newArrival: false,
            bestSeller: false,
            badge: "",
            variants: [
              {
                id: crypto.randomUUID(),
                volume: "50 ml",
                price: 0,
                sku: "",
                stock: 0,
                lowStockThreshold: 4,
                active: true,
              },
            ],
          },
    });
  const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "variants",
    });
  const name = form.watch("name");
  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}`).then(async (response) => {
      if (!response.ok) return;
      const product = await response.json() as AdminProduct;
      setExisting(product);
      form.reset(toValues(product));
    });
  }, [id, form]);
  useEffect(() => {
    if (!existing && name)
      form.setValue(
        "slug",
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        { shouldValidate: true },
      );
  }, [name, existing, form]);
  async function submit(v: Values) {
    const product: AdminProduct = {
      id: existing?.id ?? `aur-${crypto.randomUUID()}`,
      name: v.name,
      slug: v.slug,
      subtitle: v.subtitle,
      description: v.description,
      family: v.family,
      concentration: v.concentration,
      intensity: v.intensity,
      topNotes: split(v.topNotes),
      heartNotes: split(v.heartNotes),
      baseNotes: split(v.baseNotes),
      occasions: split(v.occasions),
      images: existing?.images ?? fallback.images,
      variants: v.variants,
      collections: split(v.collection),
      status: v.status,
      featured: v.featured,
      newArrival: v.newArrival,
      bestSeller: v.bestSeller,
      badge: v.badge || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSaveError("");
    const response = await fetch(existing ? `/api/admin/products/${existing.id}` : "/api/admin/products", {
      method: existing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, tags: [] }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null) as { error?: string } | null;
      setSaveError(data?.error ?? "The product couldn't be saved. Please try again.");
      return;
    }
    router.push("/admin/products");
  }
  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-10">
      <div>
        <p className="text-eyebrow text-aurevia-gold">Catalog editor</p>
        <h1 className="mt-2 font-display text-5xl text-primary">
          {existing ? `Edit ${existing.name}` : "Add New Perfume"}
        </h1>
      </div>
      <Section title="Basic Information">
        <Grid>
          <Field
            label="Product Name"
            error={form.formState.errors.name?.message}
          >
            <Input {...form.register("name")} />
          </Field>
          <Field label="Slug" error={form.formState.errors.slug?.message}>
            <Input {...form.register("slug")} />
          </Field>
          <Field
            label="Short Description"
            error={form.formState.errors.subtitle?.message}
          >
            <Input {...form.register("subtitle")} />
          </Field>
          <Field label="Concentration">
            <select
              {...form.register("concentration")}
              className="h-11 w-full border bg-white px-3"
            >
              {["Eau de Parfum", "Parfum", "Eau de Toilette"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
        </Grid>
        <Field
          label="Full Description"
          error={form.formState.errors.description?.message}
        >
          <Textarea rows={5} {...form.register("description")} />
        </Field>
      </Section>
      <Section title="Fragrance Information">
        <Grid>
          <Field label="Fragrance Family">
            <select
              {...form.register("family")}
              className="h-11 w-full border bg-white px-3"
            >
              {families.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Intensity">
            <select
              {...form.register("intensity")}
              className="h-11 w-full border bg-white px-3"
            >
              {["Light", "Moderate", "Strong"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          {[
            ["Top Notes", "topNotes"],
            ["Heart Notes", "heartNotes"],
            ["Base Notes", "baseNotes"],
            ["Mood / Occasion", "occasions"],
          ].map(([l, k]) => (
            <Field key={k} label={`${l} (comma separated)`}>
              <Input {...form.register(k as "topNotes")} />
            </Field>
          ))}
        </Grid>
      </Section>
      <Section title="Variants">
        <p className="mb-4 text-sm text-muted-foreground">
          Stock and pricing are managed per bottle size.
        </p>
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="mb-4 grid gap-3 border p-4 sm:grid-cols-3 lg:grid-cols-7"
          >
            <Input
              aria-label="Volume"
              placeholder="50 ml"
              {...form.register(`variants.${i}.volume`)}
            />
            <Input
              aria-label="Price"
              type="number"
              placeholder="Price"
              {...form.register(`variants.${i}.price`, { valueAsNumber: true })}
            />
            <Input
              aria-label="SKU"
              placeholder="SKU"
              {...form.register(`variants.${i}.sku`)}
            />
            <Input
              aria-label="Stock"
              type="number"
              placeholder="Stock"
              {...form.register(`variants.${i}.stock`, { valueAsNumber: true })}
            />
            <Input
              aria-label="Threshold"
              type="number"
              placeholder="Threshold"
              {...form.register(`variants.${i}.lowStockThreshold`, { valueAsNumber: true })}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register(`variants.${i}.active`)}
              />
              Active
            </label>
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(i)}
              disabled={fields.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        {form.formState.errors.variants?.root?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.variants.root.message}
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              volume: "",
              price: 0,
              sku: "",
              stock: 0,
              lowStockThreshold: 4,
              active: true,
            })
          }
        >
          Add Variant
        </Button>
      </Section>
      <Section title="Product Images">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(existing?.images ?? fallback.images).map(
            ([role, src]) =>
              src && (
                <div key={role}>
                  <div className="relative aspect-square overflow-hidden bg-aurevia-cream">
                    <Image
                      src={src}
                      alt={`${role} preview`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-2 capitalize">{role}</p>
                </div>
              ),
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Existing image roles are preserved. Phase 10 will connect this
          replaceable image boundary to Cloudinary uploads.
        </p>
      </Section>
      <Section title="Merchandising">
        <Grid>
          <Field label="Collection assignments (comma separated)">
            <Input {...form.register("collection")} />
          </Field>
          <Field label="Status">
            <select
              {...form.register("status")}
              className="h-11 w-full border bg-white px-3"
            >
              <option>Draft</option>
              <option>Active</option>
            </select>
          </Field>
          <Field label="Optional Badge">
            <Input {...form.register("badge")} />
          </Field>
        </Grid>
        <div className="mt-4 flex flex-wrap gap-6">
          {[
            ["Featured", "featured"],
            ["New Arrival", "newArrival"],
            ["Best Seller", "bestSeller"],
          ].map(([l, k]) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" {...form.register(k as "featured")} />
              {l}
            </label>
          ))}
        </div>
      </Section>
      <div className="flex gap-3">
        <Button type="submit">Save {existing ? "Changes" : "Product"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
      {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
    </form>
  );
}
function toValues(p: AdminProduct): Values {
  return {
    name: p.name,
    slug: p.slug,
    subtitle: p.subtitle,
    description: p.description,
    family: p.family,
    concentration: p.concentration,
    intensity: p.intensity,
    topNotes: p.topNotes.join(", "),
    heartNotes: p.heartNotes.join(", "),
    baseNotes: p.baseNotes.join(", "),
    occasions: p.occasions.join(", "),
    collection: p.collections.join(", "),
    status: p.status,
    featured: p.featured,
    newArrival: p.newArrival,
    bestSeller: p.bestSeller,
    badge: p.badge ?? "",
    variants: p.variants,
  };
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-aurevia-gold pt-6">
      <h2 className="font-display text-3xl text-primary">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error && (
        <span className="mt-1 block text-sm text-destructive">{error}</span>
      )}
    </label>
  );
}
