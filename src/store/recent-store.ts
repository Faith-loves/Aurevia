"use client"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
type RecentState={slugs:string[];view:(slug:string)=>void}
export const useRecentStore=create<RecentState>()(persist(set=>({slugs:[],view:(slug)=>set(s=>({slugs:[slug,...s.slugs.filter(x=>x!==slug)].slice(0,8)}))}),{name:"aurevia-recently-viewed",storage:createJSONStorage(()=>localStorage)}))
