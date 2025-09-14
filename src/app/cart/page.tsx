"use client";

import { useState, useEffect, useRef } from "react";
import CartList from "@/components/cart/CartList";
import CheckoutSection from "@/components/cart/CheckoutSection";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

export default function CartPage() {
  const [promoInputText, setPromoInputText] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");

  const {
    items,
    appliedPromo: appliedPromoCode,
    incrementItem,
    decrementItem,
    removeItem,
    promoCodes,
    tryApplyPromoCode,
    storeName,
    removePromoCode,
    fetchCart,
    saveCart,
  } = useCartStore();
  const { token } = useAuthStore.getState();

  useEffect(() => {
    fetchCart(token);
  }, [token, fetchCart]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const debounceTimer = setTimeout(() => {
      if (token) {
        console.log("User stopped making changes. Saving cart...");
        saveCart(token);
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [items, saveCart, token]);

  const appliedPromo = appliedPromoCode
    ? promoCodes.find((p) => p.code === appliedPromoCode) || null
    : null;

  const handleApplyPromo = () => {
    const success = tryApplyPromoCode(promoInputText);
    if (!success) {
      setPromoStatus("invalid");
    }
  };
  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInputText("");
    setPromoStatus("idle");
  };

  const handlePromoInputChange = (value: string) => {
    setPromoInputText(value);
    if (promoStatus === "invalid") {
      setPromoStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] p-4 sm:p-6 md:p-8 lg:p-12">
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CartList
              items={items}
              onDecrement={decrementItem}
              onIncrement={incrementItem}
              onRemove={removeItem}
              storeName={storeName}
            />
          </div>

          <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:h-fit">
            <CheckoutSection
              items={items}
              appliedPromo={appliedPromo}
              promoInputText={promoInputText}
              promoStatus={promoStatus}
              promoCodes={promoCodes}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              onPromoInputChange={handlePromoInputChange}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
