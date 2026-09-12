"use client"
import { Bell, Heart, Home, LogOut, MapPin, Package, Settings, Sparkles, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import type { ReactNode } from "react"
import { StoreFooter } from "@/components/storefront/store-footer"
import { StoreHeader } from "@/components/storefront/store-header"
const links=[[Home,"Overview","/account"],[Package,"Orders","/account/orders"],[Heart,"Wishlist","/wishlist"],[Sparkles,"Scent Profile","/account/scent-profile"],[MapPin,"Addresses","/account/addresses"],[UserRound,"Profile","/account/profile"],[Bell,"Notifications","/account/notifications"],[Settings,"Settings","/account/settings"]] as const
export function AccountShell({children}:{children:ReactNode}){const pathname=usePathname();return <><StoreHeader/><main className="aurevia-container grid gap-10 py-10 lg:grid-cols-[14rem_1fr] lg:py-16"><aside><nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto pb-3 lg:sticky lg:top-32 lg:flex-col lg:overflow-visible">{links.map(([Icon,label,href])=>{const active=pathname===href||(href!=="/account"&&pathname.startsWith(href));return <Link key={href} href={href} aria-current={active?"page":undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${active?"bg-aurevia-cream text-primary":"text-muted-foreground hover:text-primary"}`}><Icon className={`size-4 ${active?"text-aurevia-gold":""}`}/>{label}</Link>})}<button onClick={()=>signOut({callbackUrl:"/welcome"})} className="flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary"><LogOut className="size-4"/>Sign Out</button></nav></aside><section className="min-w-0">{children}</section></main><StoreFooter/></>}
