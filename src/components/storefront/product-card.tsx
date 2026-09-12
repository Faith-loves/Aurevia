"use client";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice, getStartingPrice } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist-store";
export function ProductCard({
  product,
  priority = false,
  imageKind = "catalog",
}: {
  product: Product;
  priority?: boolean;
  imageKind?: "catalog" | "editorial" | "ingredient";
}) {
  const saved = useWishlistStore((s) => s.slugs.includes(product.slug)),
    toggle = useWishlistStore((s) => s.toggle);
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-aurevia-cream">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.images[imageKind] ?? product.images.editorial ?? product.image}
            alt={`${product.name} fragrance campaign`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </Link>
        {(product.isNew || product.isBestSeller) && (
          <span className="absolute left-3 top-3 bg-aurevia-ivory/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {product.isNew ? "New" : "Best seller"}
          </span>
        )}
        <button
          onClick={() => toggle(product.slug)}
          aria-label={`${saved ? "Remove" : "Save"} ${product.name}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-aurevia-ivory/90 text-primary"
        >
          <Heart className={`size-4 ${saved ? "fill-aurevia-plum" : ""}`} />
        </button>
      </div>
      <div className="pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-aurevia-taupe">
          {product.setCount ? `${product.setCount}-piece gift set` : product.fragranceFamily}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 block font-display text-2xl font-semibold text-primary hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {product.subtitle}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-semibold">
            {product.setCount ? "" : "From "}
            {formatPrice(getStartingPrice(product))}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-aurevia-gold text-aurevia-gold" />
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
    </article>
  );
}
