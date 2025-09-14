"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemProps, PromoCode } from "../types";

interface PlaceOrderActionProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  shippingCost: number;
}

export default function PlaceOrderAction({
  items,
  appliedPromo,
  shippingCost,
}: PlaceOrderActionProps) {
  const { total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountCut = appliedPromo
      ? appliedPromo.type === "percentage"
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value
      : 0;
    const total = Math.max(0, subtotal - discountCut + shippingCost);
    return { total };
  }, [items, appliedPromo, shippingCost]);

  return (
    <Button
      className="w-full h-14 rounded-xl flex items-center justify-between text-base px-5 bg-primary-green-600 hover:bg-primary-green-700 shadow-lg shadow-primary-green-500/40 transform transition-transform active:scale-95"
    >
      <span className="font-bold">Place Order</span>
      <span className="font-semibold">{formatIDRCurrency(total)}</span>
    </Button>
  );
}