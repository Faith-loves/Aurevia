import type { ReactNode } from "react"
import { StoreFooter } from "./store-footer"
import { StoreHeader } from "./store-header"
export function StoreLayout({children}:{children:ReactNode}){return <div className="min-h-dvh bg-aurevia-ivory"><StoreHeader/>{children}<StoreFooter/></div>}
