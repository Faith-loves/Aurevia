"use client"
import { ProductCard } from "@/components/storefront/product-card"
import { products } from "@/data/products"
import { useRecentStore } from "@/store/recent-store"
export function RecentlyViewed({exclude}:{exclude:string}){const slugs=useRecentStore(s=>s.slugs);const items=slugs.filter(s=>s!==exclude).map(s=>products.find(p=>p.slug===s)).filter((p):p is (typeof products)[number]=>Boolean(p)).slice(0,4);if(!items.length)return null;return <section className="aurevia-container py-16"><h2 className="text-heading-2 text-primary">Recently Viewed</h2><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
