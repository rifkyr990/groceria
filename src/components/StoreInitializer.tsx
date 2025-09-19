"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function StoreInitializer() {
  useEffect(() => {
    const initialize = () => {
      // First, hydrate auth state to get the token
      useAuthStore.getState().hydrate();
      // Then, hydrate any non-DB-dependent state
      useCartStore.getState().hydratePromo();

      // Now, check if a token exists
      const token = useAuthStore.getState().token;

      // If there's a token, fetch the cart from the database
      if (token) {
        useCartStore.getState().fetchCart(token);
      }
    };
    initialize();
  }, []); // This still only runs once on initial app load

  return null;
}
