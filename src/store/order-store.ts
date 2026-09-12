"use client"
import {toast} from "sonner"
import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"
import type {CartItem} from "./cart-store"
import {useAccountStore} from "./account-store"
import {useNotificationStore} from "./notification-store"
export const DEMO_DELIVERY_DELAY_MS=10000
export type OrderStatus="confirmed"|"processing"|"shipped"|"delivered"|"cancelled"
export type OrderTimeline={confirmedAt:string;processingAt?:string;shippedAt?:string;deliveredAt?:string;cancelledAt?:string}
export type DevelopmentOrder={id:string;orderNumber:string;items:CartItem[];customer:{email:string;phone:string};shippingAddress:{firstName:string;lastName:string;address:string;apartment?:string;city:string;state:string;country:string;postalCode?:string};deliveryMethod:{id:string;name:string;estimate:string};subtotal:number;discount:number;deliveryFee:number;total:number;paymentStatus:"development-paid";orderStatus:OrderStatus;timeline:OrderTimeline;createdAt:string}
type State={orders:DevelopmentOrder[];add:(order:DevelopmentOrder)=>void;get:(id:string)=>DevelopmentOrder|undefined;accept:(id:string)=>boolean;ship:(id:string)=>boolean;cancel:(id:string)=>boolean;deliver:(id:string)=>boolean}
const notify=(audience:"ADMIN"|"CUSTOMER",type:"NEW_ORDER"|"ORDER_ACCEPTED"|"ORDER_SHIPPED"|"ORDER_DELIVERED",title:string,message:string,orderId:string)=>useNotificationStore.getState().add({audience,type,title,message,orderId})
export const useOrderStore=create<State>()(persist((set,get)=>({orders:[],
 add:order=>{set(s=>({orders:[order,...s.orders].slice(0,50)}));notify("ADMIN","NEW_ORDER","New Order Received",`Order #${order.orderNumber} has been placed by ${order.customer.email} for ₦${order.total.toLocaleString("en-NG")}.`,order.id)},
 get:id=>get().orders.find(o=>o.id===id),
 accept:id=>{const order=get().orders.find(o=>o.id===id);if(!order||order.orderStatus!=="confirmed")return false;const at=new Date().toISOString();set(s=>({orders:s.orders.map(o=>o.id===id?{...o,orderStatus:"processing",timeline:{...o.timeline,processingAt:at}}:o)}));notify("CUSTOMER","ORDER_ACCEPTED","Your order has been accepted",`Order #${order.orderNumber} is now being prepared.`,id);return true},
 ship:id=>{const order=get().orders.find(o=>o.id===id);if(!order||order.orderStatus!=="processing")return false;const at=new Date().toISOString();set(s=>({orders:s.orders.map(o=>o.id===id?{...o,orderStatus:"shipped",timeline:{...o.timeline,shippedAt:at}}:o)}));notify("CUSTOMER","ORDER_SHIPPED","Your order is on the way",`Order #${order.orderNumber} has been shipped.`,id);scheduleDelivery(id,at);return true},
 cancel:id=>{const order=get().orders.find(o=>o.id===id);if(!order||["shipped","delivered","cancelled"].includes(order.orderStatus))return false;const at=new Date().toISOString();set(s=>({orders:s.orders.map(o=>o.id===id?{...o,orderStatus:"cancelled",timeline:{...o.timeline,cancelledAt:at}}:o)}));return true},
 deliver:id=>{const order=get().orders.find(o=>o.id===id);if(!order||order.orderStatus!=="shipped")return false;const at=new Date().toISOString();set(s=>({orders:s.orders.map(o=>o.id===id?{...o,orderStatus:"delivered",timeline:{...o.timeline,deliveredAt:at}}:o)}));notify("CUSTOMER","ORDER_DELIVERED","Your package has arrived","Your Aurévia order has been delivered to your drop-off location.",id);if(useAccountStore.getState().role==="CUSTOMER")toast.success("Your package has arrived",{description:"Your Aurévia order has been delivered to your drop-off location."});return true}
}),{name:"aurevia-development-orders",version:2,storage:createJSONStorage(()=>localStorage),migrate:persisted=>{const state=persisted as State;return {...state,orders:(state.orders??[]).map(o=>({...o,timeline:o.timeline??{confirmedAt:o.createdAt}}))}},onRehydrateStorage:()=>state=>{for(const o of state?.orders??[])if(o.orderStatus==="shipped"&&o.timeline.shippedAt)scheduleDelivery(o.id,o.timeline.shippedAt)}}))
const deliveryTimers=new Map<string,ReturnType<typeof setTimeout>>()
function scheduleDelivery(id:string,shippedAt:string){if(deliveryTimers.has(id))return;const remaining=Math.max(0,DEMO_DELIVERY_DELAY_MS-(Date.now()-new Date(shippedAt).getTime()));deliveryTimers.set(id,setTimeout(()=>{deliveryTimers.delete(id);useOrderStore.getState().deliver(id)},remaining))}
export function createOrderId(){const stamp=new Date().getFullYear(),random=crypto.randomUUID().replaceAll("-","").slice(0,6).toUpperCase();return{id:`aur-${Date.now()}-${random}`,orderNumber:`AUR-${stamp}-${random}`}}
