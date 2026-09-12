import type { Metadata } from "next"
import { CheckoutPageContent } from "@/components/checkout/checkout-page-content"
export const metadata:Metadata={title:"Secure Checkout | Aurévia",description:"Complete your Aurévia fragrance order."}
export default function CheckoutPage(){return <main className="min-h-dvh bg-aurevia-ivory"><div className="aurevia-container py-6 lg:py-10"><CheckoutPageContent/></div></main>}
