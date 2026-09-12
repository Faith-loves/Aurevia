"use client";
import { Heart, Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Product, formatPrice } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useRecentStore } from "@/store/recent-store";
import { useWishlistStore } from "@/store/wishlist-store";
export function ProductExperience({ product }: { product: Product }) {
  const managedSizes = product.sizes.map((s) => ({ ...s, stock: s.stock ?? (s.inStock ? 10 : 0), threshold: s.threshold ?? 3 }));
  const [image, setImage] = useState(product.gallery[0]),
    available = managedSizes.filter((s) => s.inStock),
    [size, setSize] = useState(available[0]?.volume ?? ""),
    [quantity, setQuantity] = useState(1),
    add = useCartStore((s) => s.addItem),
    saved = useWishlistStore((s) => s.slugs.includes(product.slug)),
    toggle = useWishlistStore((s) => s.toggle),
    view = useRecentStore((s) => s.view);
  useEffect(() => {
    view(product.slug);
  }, [product.slug, view]);
  const selected = managedSizes.find((s) => s.volume === size);
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-aurevia-cream">
          <Image
            src={image}
            alt={`${product.name} perfume`}
            fill
            priority
            sizes="(max-width:1024px) 100vw,50vw"
            className="object-cover"
          />
        </div>
        {product.gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                onClick={() => setImage(src)}
                aria-label={`View ${product.name} image ${i + 1}`}
                aria-pressed={image === src}
                className={`relative aspect-square overflow-hidden border-2 ${image === src ? "border-aurevia-plum" : "border-transparent"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="lg:pt-8">
        <p className="text-eyebrow text-aurevia-gold">
          {product.fragranceFamily} · {product.concentration}
        </p>
        <h1 className="text-display mt-3 text-primary">{product.name}</h1>
        <p className="mt-3 font-display text-2xl text-muted-foreground">
          {product.subtitle}
        </p>
        <a
          href="#reviews"
          className="mt-5 inline-flex items-center gap-2 text-sm"
        >
          <Star className="size-4 fill-aurevia-gold text-aurevia-gold" />
          <strong>{product.rating}</strong>
          <span className="text-muted-foreground">
            {product.reviewCount} reviews
          </span>
        </a>
        <p className="mt-5 text-2xl font-semibold">
          {formatPrice(selected?.price ?? product.price)}
        </p>
        <p className="mt-5 leading-7 text-muted-foreground">
          {product.description}
        </p>
        <fieldset className="mt-8">
          <legend className="font-semibold">Select size</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {managedSizes.map((option) => (
              <button
                key={option.volume}
                disabled={!option.inStock}
                onClick={() => setSize(option.volume)}
                aria-pressed={size === option.volume}
                className={`min-w-24 border px-4 py-3 text-sm font-semibold ${size === option.volume ? "border-aurevia-plum bg-aurevia-plum text-aurevia-ivory" : "bg-transparent"} disabled:cursor-not-allowed disabled:opacity-35`}
              >
                {option.volume}
                <span className="mt-1 block text-xs font-normal">
                  {formatPrice(option.price)}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="mt-7">
          <span className="font-semibold">Quantity</span>
          <div className="mt-3 flex w-fit items-center border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="size-11"
            >
              <Minus className="mx-auto size-4" />
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() =>
                setQuantity((q) => Math.min(selected?.stock ?? 10, q + 1))
              }
              aria-label="Increase quantity"
              className="size-11"
            >
              <Plus className="mx-auto size-4" />
            </button>
          </div>
        </div>
        {selected && selected.stock > 0 && selected.stock <= selected.threshold && (
          <p className="mt-5 text-sm font-medium text-warning">
            Only {selected.stock} left
          </p>
        )}
        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button
            size="lg"
            disabled={!selected?.inStock}
            onClick={() =>
              selected &&
              add({
                productId: product.id,
                variantId: selected.id,
                slug: product.slug,
                name: product.name,
                image: product.image,
                family: product.fragranceFamily,
                size: selected.volume,
                unitPrice: selected.price,
                quantity,
                availableStock: selected.stock,
              })
            }
            className="h-14"
          >
            {selected?.inStock ? "Add to Bag" : "Out of Stock"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => toggle(product.slug)}
            aria-pressed={saved}
            aria-label={`${saved ? "Remove from" : "Add to"} wishlist`}
            className="h-14"
          >
            <Heart className={saved ? "fill-aurevia-plum" : ""} />
            <span className="sm:hidden">
              {saved ? "Saved" : "Save to Wishlist"}
            </span>
          </Button>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Delivery options and final cost are calculated at checkout.
        </p>
      </div>
    </div>
  );
}
