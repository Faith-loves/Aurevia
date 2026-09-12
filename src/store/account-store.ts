"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ScentFinderAnswers } from "@/lib/scent-finder";
export type Address = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phone: string;
  isDefault: boolean;
};
export type AccountNotification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  href?: string;
};
export type SavedScentProfile = {
  name: string;
  description: string;
  answers: ScentFinderAnswers;
  recommendedProductIds: string[];
  updatedAt: string;
};
export type AccountRole = "CUSTOMER" | "ADMIN";
type AccountState = {
  isAuthenticated: boolean;
  role: AccountRole;
  profile: {
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  scentProfile: SavedScentProfile | null;
  addresses: Address[];
  notifications: AccountNotification[];
  preferences: {
    orderUpdates: boolean;
    recommendations: boolean;
    newsletter: boolean;
  };
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  saveScentProfile: (profile: SavedScentProfile) => void;
  updateProfile: (data: { fullName: string; phone: string }) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setPreference: (
    key: "orderUpdates" | "recommendations" | "newsletter",
    value: boolean,
  ) => void;
};
export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: "CUSTOMER",
      profile: { fullName: "", email: "", phone: "", createdAt: "" },
      scentProfile: null,
      addresses: [],
      notifications: [],
      preferences: {
        orderUpdates: true,
        recommendations: true,
        newsletter: false,
      },
      signIn: (email, name = "") =>
        set((s) => ({
          isAuthenticated: true,
          role:
            email.toLowerCase() === "admin@aurevia.com"
              ? "ADMIN"
              : "CUSTOMER",
          profile: {
            ...s.profile,
            email,
            fullName: name || s.profile.fullName,
            createdAt: s.profile.createdAt || new Date().toISOString(),
          },
        })),
      signOut: () => set({ isAuthenticated: false }),
      saveScentProfile: (scentProfile) => set({ scentProfile }),
      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),
      saveAddress: (address) =>
        set((s) => {
          const exists = s.addresses.some((a) => a.id === address.id);
          let addresses = exists
            ? s.addresses.map((a) => (a.id === address.id ? address : a))
            : [...s.addresses, address];
          if (address.isDefault)
            addresses = addresses.map((a) => ({
              ...a,
              isDefault: a.id === address.id,
            }));
          return { addresses };
        }),
      deleteAddress: (id) =>
        set((s) => {
          let addresses = s.addresses.filter((a) => a.id !== id);
          if (addresses.length && !addresses.some((a) => a.isDefault))
            addresses = addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
          return { addresses };
        }),
      setDefault: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      setPreference: (key, value) =>
        set((s) => ({ preferences: { ...s.preferences, [key]: value } })),
    }),
    {
      name: "aurevia-development-account",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
