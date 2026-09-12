"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  families,
  getStartingPrice,
  normalizeSearch,
  type Product,
} from "@/data/products";
import { ProductCard } from "./product-card";

const toParam = (value: string) =>
  normalizeSearch(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const filterGroups = [
  {
    key: "family",
    title: "Fragrance Family",
    values: families.map((value) => [value, value.toLowerCase()]),
  },
  {
    key: "intensity",
    title: "Intensity",
    values: ["Light", "Moderate", "Strong"].map((value) => [
      value,
      value.toLowerCase(),
    ]),
  },
  {
    key: "concentration",
    title: "Concentration",
    values: ["Eau de Parfum", "Parfum", "Eau de Toilette"].map((value) => [
      value,
      toParam(value),
    ]),
  },
  {
    key: "price",
    title: "Starting Price",
    values: [
      ["Under ₦65,000", "under-65000"],
      ["₦65,000–₦85,000", "65000-85000"],
      ["Over ₦85,000", "over-85000"],
    ],
  },
];

function Filters({
  setParam,
  params,
}: {
  setParam: (key: string, value: string) => void;
  params: URLSearchParams;
}) {
  return (
    <div className="space-y-7">
      {filterGroups.map((group) => (
        <div key={group.key}>
          <h3 className="font-semibold">{group.title}</h3>
          <div className="mt-3 space-y-2">
            {group.values.map(([label, value]) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={params.get(group.key) === value}
                  onCheckedChange={(checked) =>
                    setParam(group.key, checked ? value : "")
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={params.get("stock") === "in"}
          onCheckedChange={(checked) => setParam("stock", checked ? "in" : "")}
        />
        In Stock
      </label>
    </div>
  );
}

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const search = useSearchParams();
  const params = new URLSearchParams(search.toString());

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(search.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/shop${next.size ? `?${next}` : ""}`);
  }

  const list = useMemo(() => {
    let result = [...products];
    const family = search.get("family");
    const intensity = search.get("intensity");
    const concentration = search.get("concentration");
    const collection = search.get("collection");
    const price = search.get("price");
    const query = search.get("q")
      ? normalizeSearch(search.get("q")!)
      : undefined;

    if (family)
      result = result.filter(
        (product) => product.fragranceFamily.toLowerCase() === family,
      );
    if (intensity)
      result = result.filter(
        (product) => product.intensity.toLowerCase() === intensity,
      );
    if (concentration)
      result = result.filter(
        (product) => toParam(product.concentration) === concentration,
      );
    if (collection === "new") result = result.filter((product) => product.isNew);
    else if (collection === "best-sellers")
      result = result.filter((product) => product.isBestSeller);
    else if (collection)
      result = result.filter(
        (product) => toParam(product.collection) === collection,
      );
    if (price === "under-65000")
      result = result.filter((product) => getStartingPrice(product) < 65000);
    if (price === "65000-85000")
      result = result.filter((product) => {
        const startingPrice = getStartingPrice(product);
        return startingPrice >= 65000 && startingPrice <= 85000;
      });
    if (price === "over-85000")
      result = result.filter((product) => getStartingPrice(product) > 85000);
    if (search.get("stock") === "in")
      result = result.filter((product) =>
        product.sizes.some((size) => size.inStock),
      );
    if (query)
      result = result.filter((product) =>
        normalizeSearch(JSON.stringify(product)).includes(query),
      );

    const sort = search.get("sort") ?? "alphabetical";
    if (sort === "newest") {
      result.sort(
        (a, b) =>
          Number(b.isNew) - Number(a.isNew) ||
          products.indexOf(b) - products.indexOf(a),
      );
    } else if (sort === "price-low") {
      result.sort(
        (a, b) =>
          getStartingPrice(a) - getStartingPrice(b) ||
          a.name.localeCompare(b.name),
      );
    } else if (sort === "price-high") {
      result.sort(
        (a, b) =>
          getStartingPrice(b) - getStartingPrice(a) ||
          a.name.localeCompare(b.name),
      );
    } else if (sort === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    } else if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          Number(b.isBestSeller) - Number(a.isBestSeller) ||
          b.rating - a.rating,
      );
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
    }
    return result;
  }, [products, search]);

  const active = [
    "family",
    "intensity",
    "concentration",
    "collection",
    "price",
    "stock",
    "q",
  ].some((key) => search.has(key));

  const quickCategories = [
    ["Shop All", "", ""],
    ["New Arrivals", "collection", "new"],
    ["Best Sellers", "collection", "best-sellers"],
    ["Fresh Collection", "collection", "fresh"],
    ...families.map((family) => [family, "family", family.toLowerCase()]),
  ];

  return (
    <div>
      <nav
        aria-label="Shop categories"
        className="mb-5 flex gap-2 overflow-x-auto pb-2"
      >
        {quickCategories.map(([label, key, value]) => {
          const selected = key
            ? search.get(key) === value
            : !search.has("family") && !search.has("collection");
          return (
            <button
              key={label}
              type="button"
              aria-pressed={selected}
              onClick={() => (key ? setParam(key, value) : router.push("/shop"))}
              className={`shrink-0 border px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? "border-aurevia-plum bg-aurevia-plum text-aurevia-ivory"
                  : "bg-white hover:border-aurevia-gold"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y py-4">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="overflow-y-auto bg-aurevia-ivory p-5"
            >
              <SheetHeader className="px-0">
                <SheetTitle className="text-heading-3">Filters</SheetTitle>
              </SheetHeader>
              <Filters setParam={setParam} params={params} />
              <Button
                onClick={() => router.push("/shop")}
                variant="outline"
                className="mt-8 w-full"
              >
                Clear All
              </Button>
            </SheetContent>
          </Sheet>
          <span className="text-sm text-muted-foreground">
            {list.length} {list.length === 1 ? "fragrance" : "fragrances"}
          </span>
          {active && (
            <button
              onClick={() => router.push("/shop")}
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <X className="size-4" />
              Clear All
            </button>
          )}
        </div>
        <Select
          value={search.get("sort") || "alphabetical"}
          onValueChange={(value) =>
            setParam("sort", value === "alphabetical" ? "" : value)
          }
        >
          <SelectTrigger aria-label="Sort by" className="h-10 min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical">Alphabetical A–Z</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Best Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-10 py-10 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block">
          <Filters setParam={setParam} params={params} />
        </aside>
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {list.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-96 items-center justify-center text-center">
            <div>
              <h2 className="font-display text-4xl text-primary">
                Nothing matches those filters — yet.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Try removing a filter or explore the full Aurévia collection.
              </p>
              <Button onClick={() => router.push("/shop")} className="mt-6">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
