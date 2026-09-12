"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {useAdminStore} from "./admin-store";
export type CartItem = {
  lineId: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  family: string;
  size: string;
  unitPrice: number;
  quantity: number;
  availableStock?: number;
};
type CartState = {
  items: CartItem[];
  promo: string | null;
  drawerOpen: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
};
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promo: null,
      drawerOpen: false,
      addItem: (item) =>
        set((s) => {
          const lineId = item.variantId ?? `${item.productId}:${item.size}`;
          const existing = s.items.find((x) => x.lineId === lineId);
          return {
            items: existing
              ? s.items.map((x) =>
                  x.lineId === lineId
                    ? {
                        ...x,
                        quantity: Math.min(
                          x.availableStock ?? 10,
                          x.quantity + item.quantity,
                        ),
                      }
                    : x,
                )
              : [...s.items, { ...item, lineId }],
            drawerOpen: true,
          };
        }),
      removeItem: (lineId) =>
        set((s) => ({ items: s.items.filter((x) => x.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((s) => ({
          items: s.items.map((x) =>
            x.lineId === lineId
              ? {
                  ...x,
                  quantity: Math.max(
                    1,
                    Math.min(x.availableStock ?? 10, quantity),
                  ),
                }
              : x,
          ),
        })),
      clearCart: () => set({ items: [], promo: null }),
      setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
      applyPromo: (code) => {
        const clean=code.trim().toUpperCase(),now=new Date().toISOString().slice(0,10),subtotal=cartSubtotal(useCartStore.getState().items),promotion=useAdminStore.getState().promotions.find(p=>p.code.toUpperCase()===clean),valid=Boolean(promotion&&promotion.status==="Active"&&promotion.startDate<=now&&promotion.endDate>=now&&subtotal>=(promotion.minimumOrder??0));
        if (valid) set({ promo: clean });
        return valid;
      },
      removePromo: () => set({ promo: null }),
    }),
    {
      name: "aurevia-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, promo: s.promo }),
    },
  ),
);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);
export const cartDiscount = (items: CartItem[], promo: string | null) => {
  if(!promo)return 0;const p=useAdminStore.getState().promotions.find(x=>x.code.toUpperCase()===promo.toUpperCase()),now=new Date().toISOString().slice(0,10),subtotal=cartSubtotal(items);if(!p||p.status!=="Active"||p.startDate>now||p.endDate<now||subtotal<(p.minimumOrder??0))return 0;return p.type==="percentage"?Math.round(subtotal*p.value/100):Math.min(subtotal,p.value)
};
