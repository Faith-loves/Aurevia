import type { Metadata } from "next"
import { Suspense } from "react"
import { ShopBrowser } from "@/components/storefront/shop-browser"
import { StoreLayout } from "@/components/storefront/store-layout"
import { getCatalogProducts } from "@/lib/server/catalog"
export const metadata:Metadata={title:"Shop Perfumes | Aurévia",description:"Explore the complete Aurévia fragrance collection."}
const collectionCopy:Record<string,{eyebrow:string;title:string;copy:string}>={
 new:{eyebrow:"Just arrived",title:"New Arrivals",copy:"The latest Aurévia creations, each with a distinct bottle and scent story."},
 "best-sellers":{eyebrow:"Most loved",title:"Best Sellers",copy:"A considered combination of established favourites and the most-loved new creations."},
 gifting:{eyebrow:"For every occasion",title:"The Gifting Collection",copy:"Two- and three-fragrance edits for partners, birthdays, anniversaries and meaningful milestones."},
 "after-dark":{eyebrow:"The editorial collection",title:"After Dark",copy:"Deep woods, warm amber and lingering spice for evenings that stay with you."},
 daylight:{eyebrow:"Luminous signatures",title:"Daylight",copy:"Radiant florals, polished citrus and clean musk for bright, effortless wear."},
 fresh:{eyebrow:"New collection",title:"Fresh",copy:"Sixteen clear, green, mineral and ocean-inspired fragrances — from light Eau de Toilette to strong Parfum."},
 elements:{eyebrow:"Rooted in nature",title:"Elements",copy:"Woods, minerals, rain and aromatic greens composed with quiet precision."},
 "golden-hour":{eyebrow:"Lit from within",title:"Golden Hour",copy:"Solar florals, glowing citrus and warm resins captured at their most luminous."},
 "modern-romance":{eyebrow:"A new expression",title:"Modern Romance",copy:"Contemporary florals, fruit and woods with a sensual, polished edge."},
 nocturne:{eyebrow:"After twilight",title:"Nocturne",copy:"Iris, incense, dark petals and woods created for the hours after dusk."},
 "quiet-luxury":{eyebrow:"Softly composed",title:"Quiet Luxury",copy:"Understated woods, musk and refined florals that stay close to the skin."},
}
const familyCopy:Record<string,{eyebrow:string;title:string;copy:string}>={
 floral:{eyebrow:"Fragrance family",title:"Floral Fragrances",copy:"Discover radiant petals, modern bouquets and sensual floral signatures."},
 woody:{eyebrow:"Fragrance family",title:"Woody Fragrances",copy:"Explore polished cedar, sandalwood, vetiver and deep, textural woods."},
 amber:{eyebrow:"Fragrance family",title:"Amber Fragrances",copy:"Warm resins, glowing spice and enveloping vanilla define this rich collection."},
 oud:{eyebrow:"Fragrance family",title:"Oud Fragrances",copy:"Discover commanding oud compositions layered with spice, woods and resin."},
 citrus:{eyebrow:"Fragrance family",title:"Citrus Fragrances",copy:"Bright bergamot, neroli and sparkling citrus bring energy and clarity."},
 fresh:{eyebrow:"Fragrance family",title:"Fresh Fragrances",copy:"Clean air, rain, aromatic greens and mineral notes create effortless freshness."},
}
export const dynamic = "force-dynamic"
export default async function ShopPage({searchParams}:{searchParams:Promise<{collection?:string|string[];family?:string|string[]}>}){const params=await searchParams,rawCollection=params.collection,rawFamily=params.family,collection=Array.isArray(rawCollection)?rawCollection[0]:rawCollection,family=Array.isArray(rawFamily)?rawFamily[0]:rawFamily,content=collectionCopy[collection??""]??familyCopy[family??""]??{eyebrow:"The collection",title:"All Fragrances",copy:"Explore the complete Aurévia collection and find the scents that speak to you."}, products=await getCatalogProducts();return <StoreLayout><main className="aurevia-container py-14 sm:py-20"><p className="text-eyebrow text-aurevia-gold">{content.eyebrow}</p><h1 className="text-display mt-3 text-primary">{content.title}</h1><p className="mt-4 max-w-2xl text-lg text-muted-foreground">{content.copy}</p><div className="mt-10"><Suspense fallback={<p>Loading the collection…</p>}><ShopBrowser products={products}/></Suspense></div></main></StoreLayout>}
