"use client"
import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"
export type NotificationAudience="CUSTOMER"|"ADMIN"
export type NotificationType="NEW_ORDER"|"ORDER_ACCEPTED"|"ORDER_SHIPPED"|"ORDER_DELIVERED"
export type AppNotification={id:string;audience:NotificationAudience;type:NotificationType;title:string;message:string;orderId?:string;read:boolean;createdAt:string}
type State={notifications:AppNotification[];add:(n:Omit<AppNotification,"id"|"read"|"createdAt">)=>void;markRead:(id:string)=>void;markAllRead:(audience:NotificationAudience)=>void}
export const useNotificationStore=create<State>()(persist(set=>({notifications:[],add:n=>set(s=>({notifications:[{...n,id:crypto.randomUUID(),read:false,createdAt:new Date().toISOString()},...s.notifications].slice(0,100)})),markRead:id=>set(s=>({notifications:s.notifications.map(n=>n.id===id?{...n,read:true}:n)})),markAllRead:audience=>set(s=>({notifications:s.notifications.map(n=>n.audience===audience?{...n,read:true}:n)}))}),{name:"aurevia-development-notifications",storage:createJSONStorage(()=>localStorage)}))
