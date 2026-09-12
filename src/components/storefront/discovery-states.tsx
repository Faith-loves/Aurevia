"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
export function ProductGridSkeleton(){return <div aria-label="Loading fragrances" className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i}><Skeleton className="aspect-[4/5] w-full bg-aurevia-cream"/><Skeleton className="mt-4 h-4 w-20"/><Skeleton className="mt-2 h-7 w-3/4"/><Skeleton className="mt-3 h-4 w-28"/></div>)}</div>}
export function ProductDiscoveryError({retry}:{retry:()=>void}){return <div role="alert" className="py-20 text-center"><h2 className="font-display text-4xl text-primary">We couldn&apos;t load the collection.</h2><Button onClick={retry} className="mt-6">Try Again</Button></div>}
