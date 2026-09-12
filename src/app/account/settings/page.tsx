"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAccountStore } from "@/store/account-store";
export default function SettingsPage() {
  const preferences = useAccountStore((s) => s.preferences),
    setPreference = useAccountStore((s) => s.setPreference),
    signOut = useAccountStore((s) => s.signOut),
    router = useRouter(),
    [confirm, setConfirm] = useState(false);
  const all: [
    [keyof typeof preferences, string, string],
    [keyof typeof preferences, string, string],
    [keyof typeof preferences, string, string],
  ] = [
    [
      "orderUpdates",
      "Order updates",
      "Order confirmation and delivery progress",
    ],
    [
      "recommendations",
      "Product recommendations",
      "Occasional suggestions based on your browsing",
    ],
    [
      "newsletter",
      "Newsletter and scent stories",
      "Editorial notes and new fragrance releases",
    ],
  ];
  return (
    <div>
      <p className="text-eyebrow text-aurevia-gold">Preferences</p>
      <h1 className="text-display mt-3 text-primary">Settings</h1>
      <section className="mt-9 max-w-2xl">
        <h2 className="font-display text-3xl text-primary">Communication</h2>
        <div className="mt-5 divide-y border-y">
          {all.map(([key, title, copy]) => (
            <label key={key} className="flex cursor-pointer gap-4 py-5">
              <Checkbox
                checked={preferences[key]}
                onCheckedChange={(value) => setPreference(key, value === true)}
              />
              <span>
                <strong>{title}</strong>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {copy}
                </span>
              </span>
            </label>
          ))}
        </div>
        <h2 className="mt-10 font-display text-3xl text-primary">Account</h2>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="font-semibold text-primary underline"
          >
            Privacy
          </Link>
          <Link href="/terms" className="font-semibold text-primary underline">
            Terms
          </Link>
          <button
            onClick={() => setConfirm(true)}
            className="font-semibold text-destructive underline"
          >
            Sign Out
          </button>
        </div>
      </section>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out of Aurévia?</DialogTitle>
            <DialogDescription>
              Your guest cart and wishlist will remain on this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                signOut();
                router.push("/welcome");
              }}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
