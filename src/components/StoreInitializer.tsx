"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function StoreInitializer() {
  useEffect(() => {
    const initialize = () => {
      useAuthStore.getState().hydrate();

      useCartStore.getState().hydratePromo();

      const token = useAuthStore.getState().token;
      if (token) {
        useCartStore.getState().fetchCart(token);
      } else {
        useCartStore.getState().resetCart();
      }
    };
    initialize();
  }, []);

  return null;
}
