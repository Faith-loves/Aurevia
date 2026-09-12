import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/product/product-experience";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductCard } from "@/components/storefront/product-card";
import { StoreLayout } from "@/components/storefront/store-layout";
import { getCatalogProduct, getCatalogProducts } from "@/lib/server/catalog";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params,
    p = await getCatalogProduct(slug);
  return p
    ? {
        title: `${p.name} | Aurévia`,
        description: p.description,
        openGraph: { images: [p.image] },
      }
    : { title: "Fragrance not found | Aurévia" };
}
export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params,
    p = await getCatalogProduct(slug);
  if (!p) notFound();
  const related = (await getCatalogProducts()).filter((product) => product.fragranceFamily === p.fragranceFamily && product.slug !== p.slug).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.gallery,
    description: p.description,
    brand: { "@type": "Brand", name: "Aurévia" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NGN",
      lowPrice: Math.min(...p.sizes.map((s) => s.price)),
      highPrice: Math.max(...p.sizes.map((s) => s.price)),
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <StoreLayout>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="aurevia-container py-10 lg:py-16">
          <ProductExperience product={p} />
          <nav
            aria-label="Product guidance"
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t pt-6 text-sm font-semibold text-primary"
          >
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/fragrance-guide">Fragrance terminology</Link>
          </nav>
        </section>
        <section className="bg-aurevia-cream py-20">
          <div className="aurevia-container">
            <p className="text-eyebrow text-aurevia-gold">Scent pyramid</p>
            <h2 className="text-heading-1 mt-3 text-primary">The Notes</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                ["Top notes", "What is noticed first", p.topNotes],
                ["Heart notes", "The character at its core", p.heartNotes],
                ["Base notes", "What lingers", p.baseNotes],
              ].map(([title, copy, notes]) => (
                <div
                  key={String(title)}
                  className="border-t border-aurevia-gold pt-5"
                >
                  <h3 className="font-display text-3xl text-primary">
                    {String(title)}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {String(copy)}
                  </p>
                  <p className="mt-5 text-lg">
                    {(notes as string[]).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="aurevia-container grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow text-aurevia-gold">The story</p>
            <h2 className="text-heading-2 mt-3 text-primary">
              A composition with presence.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {p.description}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 border-y py-8">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Collection
              </dt>
              <dd className="mt-2 font-display text-2xl text-primary">
                {p.collection}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Family
              </dt>
              <dd className="mt-2 font-display text-2xl text-primary">
                {p.fragranceFamily}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Intensity
              </dt>
              <dd className="mt-2 font-display text-2xl text-primary">
                {p.intensity}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Concentration
              </dt>
              <dd className="mt-2 font-display text-2xl text-primary">
                {p.concentration}
              </dd>
            </div>
          </dl>
        </section>
        <section
          id="reviews"
          className="bg-aurevia-plum py-20 text-aurevia-ivory"
        >
          <div className="aurevia-container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-eyebrow text-aurevia-gold">
                  Worn and remembered
                </p>
                <h2 className="text-heading-1 mt-3">Reviews</h2>
              </div>
              <div>
                <span className="font-display text-5xl">{p.rating}</span>
                <p className="text-sm text-aurevia-ivory/70">
                  ★★★★★ · {p.reviewCount} reviews
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {p.reviews.map((r) => (
                <article
                  key={r.id}
                  className="border-t border-aurevia-gold/50 pt-5"
                >
                  <p className="text-aurevia-gold">{"★".repeat(r.rating)}</p>
                  <h3 className="mt-4 font-display text-2xl">{r.title}</h3>
                  <p className="mt-3 leading-7 text-aurevia-ivory/75">
                    {r.body}
                  </p>
                  <p className="mt-5 text-xs text-aurevia-ivory/55">
                    {r.name} · {r.date}
                    {r.verified ? " · Verified purchase" : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="aurevia-container py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-eyebrow text-aurevia-gold">Keep exploring</p>
              <h2 className="text-heading-1 mt-3 text-primary">
                You May Also Like
              </h2>
            </div>
            <Link
              href={`/shop?family=${p.fragranceFamily.toLowerCase()}`}
              className="hidden font-semibold text-primary underline sm:block"
            >
              Explore {p.fragranceFamily}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
        <RecentlyViewed exclude={p.slug} />
      </main>
    </StoreLayout>
  );
}
