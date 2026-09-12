import {OrderAdminDetail} from "@/components/admin/admin-pages"
export default async function Page({params}:PageProps<"/admin/orders/[orderId]">){const {orderId}=await params;return <OrderAdminDetail id={orderId}/>}
