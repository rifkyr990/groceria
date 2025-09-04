"use client";

import { useState } from "react";
import CartList from "@/components/cart/CartList";
import CheckoutSection from "@/components/cart/CheckoutSection";
import { mockCartItems } from "@/components/cart/dummy-data/Data-CartItem";
import { mockPromoCodes } from "@/components/cart/dummy-data/Data-Promo";
import { CartItemProps, PromoCode } from "@/components/types";

export default function ComponentTest() {
  const [items, setItems] = useState<CartItemProps[]>(mockCartItems);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoInputText, setPromoInputText] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");

  const handleIncrement = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = () => {
    const code = promoInputText.trim();
    if (!code) return;

    const found = promoCodes.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );
    if (found) {
      setAppliedPromo(found);
      setPromoStatus("idle");
    } else {
      setAppliedPromo(null);
      setPromoStatus("invalid");
    }
  };

  const handlePromoInputChange = (value: string) => {
    setPromoInputText(value);
    if (appliedPromo && value !== appliedPromo.code) {
      setAppliedPromo(null);
    }
    if (promoStatus === "invalid") {
      setPromoStatus("idle");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInputText("");
    setPromoStatus("idle");
  };

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <CartList
          items={items}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          onRemove={handleRemove}
        />
      </div>
      <div>
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
    </section>
  );
}
