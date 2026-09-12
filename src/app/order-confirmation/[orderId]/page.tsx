import { OrderConfirmation } from "@/components/checkout/order-confirmation"
export default async function ConfirmationPage({params}:PageProps<"/order-confirmation/[orderId]">){const {orderId}=await params;return <main className="min-h-dvh bg-aurevia-ivory"><div className="aurevia-container"><OrderConfirmation id={orderId}/></div></main>}
