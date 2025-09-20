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
        // If a user is logged in, fetch their cart from the database.
        useCartStore.getState().fetchCart(token);
      } else {
        // If no user is logged in, ensure the cart is empty as a failsafe.
        useCartStore.getState().resetCart();
      }
    };
    initialize();
  }, []);

  return null;
}
