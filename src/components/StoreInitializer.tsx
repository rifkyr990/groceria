"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function StoreInitializer() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useCartStore.getState().hydratePromo();
  }, []);

  return null;
}
