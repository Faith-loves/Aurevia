"use client"
import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"
import {emptyFinderAnswers,type ScentFinderAnswers,type ScentProfileResult} from "@/lib/scent-finder"
type FinderState={answers:ScentFinderAnswers;result:ScentProfileResult|null;setAnswers:(answers:ScentFinderAnswers)=>void;setResult:(result:ScentProfileResult)=>void;reset:()=>void}
export const useScentFinderStore=create<FinderState>()(persist(set=>({answers:emptyFinderAnswers,result:null,setAnswers:answers=>set({answers}),setResult:result=>set({result}),reset:()=>set({answers:emptyFinderAnswers,result:null})}),{name:"aurevia-scent-finder",storage:createJSONStorage(()=>sessionStorage)}))
