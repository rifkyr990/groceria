"use client";

import { useMemo } from "react";
import OrderSummary from "./OrderSummary";
import PromoInput from "./PromoInput";
import { CheckoutSectionProps } from "@/components/types";
import CheckoutButton from "./CheckoutButton";

export default function CheckoutSection({
  items,
  appliedPromo,
  promoInputText,
  promoStatus,
  promoCodes,
  onApplyPromo,
  onRemovePromo,
  onPromoInputChange,
}: CheckoutSectionProps) {
  const { subtotal, discountCut, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountCut = appliedPromo
      ? appliedPromo.type === "percentage"
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value
      : 0;
    const total = Math.max(0, subtotal - discountCut);
    return { subtotal, discountCut, total };
  }, [items, appliedPromo]);

  return (
    <div className="space-y-6 sticky top-28">
      <OrderSummary
        subtotal={subtotal}
        discountCut={discountCut}
        total={total}
      />
      <PromoInput
        inputText={promoInputText}
        status={promoStatus}
        appliedPromo={appliedPromo}
        promoCodes={promoCodes}
        onInputChange={onPromoInputChange}
        onApply={onApplyPromo}
        onRemove={onRemovePromo}
      />
      <CheckoutButton onCheckout={() => {}} total={total} />
    </div>
  );
}
