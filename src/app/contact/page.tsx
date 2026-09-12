import type {Metadata} from "next"
import {Suspense} from "react"
import {ContactForm} from "@/components/help/contact-form"
import {StoreLayout} from "@/components/storefront/store-layout"
export const metadata:Metadata={title:"Contact Aurévia",description:"Contact Aurévia for help with orders, delivery, returns, fragrances or your account."}
export default function Contact(){return <StoreLayout><main className="aurevia-container grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-eyebrow text-aurevia-gold">Contact Aurévia</p><h1 className="text-display mt-3 text-primary">We&apos;re here to help.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">Questions about an order, a fragrance or your account? Send us a message.</p><p className="mt-8 border-t border-aurevia-gold pt-5 text-sm leading-6 text-muted-foreground">This form uses the current development support boundary and does not yet send to a live helpdesk.</p></div><Suspense fallback={<div className="min-h-96 bg-aurevia-cream"/>}><ContactForm/></Suspense></main></StoreLayout>}
