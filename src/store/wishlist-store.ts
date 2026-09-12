"use client"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
type WishlistState={slugs:string[];toggle:(slug:string)=>void;remove:(slug:string)=>void;contains:(slug:string)=>boolean}
export const useWishlistStore=create<WishlistState>()(persist((set,get)=>({slugs:[],toggle:(slug)=>set(s=>({slugs:s.slugs.includes(slug)?s.slugs.filter(x=>x!==slug):[...s.slugs,slug]})),remove:(slug)=>set(s=>({slugs:s.slugs.filter(x=>x!==slug)})),contains:(slug)=>get().slugs.includes(slug)}),{name:"aurevia-wishlist",storage:createJSONStorage(()=>localStorage)}))
