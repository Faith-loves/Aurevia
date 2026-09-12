import type {Metadata} from "next"
import {FinderExperience} from "@/components/finder/finder-experience"
import { StoreLayout } from "@/components/storefront/store-layout"
export const metadata:Metadata={title:"Scent Finder Consultation | Aurévia",robots:{index:false,follow:true}}
export default function FinderStart(){return <StoreLayout><FinderExperience/></StoreLayout>}
