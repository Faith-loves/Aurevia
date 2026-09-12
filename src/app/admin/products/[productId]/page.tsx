import {ProductAdminForm} from "@/components/admin/product-form"
export default async function Page({params}:PageProps<"/admin/products/[productId]">){const {productId}=await params;return <ProductAdminForm id={productId}/>}
