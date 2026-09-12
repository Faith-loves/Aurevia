import type {Metadata} from "next"
import {FAQList} from "@/components/help/faq-list"
import {StoreLayout} from "@/components/storefront/store-layout"
import {faqItems} from "@/data/help"
export const metadata:Metadata={title:"Frequently Asked Questions | Aurévia",description:"Answers about shopping, fragrances, orders, delivery, returns and Aurévia accounts."}
export default function FAQPage(){const schema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqItems.map(x=>({"@type":"Question",name:x.question,acceptedAnswer:{"@type":"Answer",text:x.answer}}))};return <StoreLayout><main className="aurevia-container max-w-4xl py-16"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><p className="text-eyebrow text-aurevia-gold">Help centre</p><h1 className="text-display mt-3 text-primary">Frequently asked questions.</h1><p className="mt-5 text-lg text-muted-foreground">Clear answers for shopping, fragrance discovery and your Aurévia account.</p><FAQList/></main></StoreLayout>}
