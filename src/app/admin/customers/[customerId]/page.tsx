import {CustomerDetail} from "@/components/admin/admin-pages"
export default async function Page({params}:PageProps<"/admin/customers/[customerId]">){const {customerId}=await params;return <CustomerDetail id={customerId}/>}
