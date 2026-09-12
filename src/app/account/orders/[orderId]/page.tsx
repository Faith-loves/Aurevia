import { OrderDetail } from "@/components/account/orders-content"
export default async function OrderPage({params}:PageProps<"/account/orders/[orderId]">){const {orderId}=await params;return <OrderDetail id={orderId}/>}
