import { OrderTracking } from "@/components/account/orders-content"
export default async function TrackingPage({params}:PageProps<"/account/orders/[orderId]/tracking">){const {orderId}=await params;return <OrderTracking id={orderId}/>}
