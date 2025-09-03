"use client";

import { useState, useMemo } from "react";
import OrderSummary from "./OrderSummary";
import { CartItemProps } from "../types";

interface Props {
  items: CartItemProps[];
}

export default function CheckoutSection({ items }: Props) {
  const [promo, setPromo] = useState<null | {
    code: string;
    type: "percentage" | "fixed";
    value: number;
  }>(null);

  const { subtotal, discountCut, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discountCut = promo
      ? promo.type === "percentage"
        ? Math.round((subtotal * promo.value) / 100)
        : promo.value
      : 0;

    const total = subtotal - discountCut;
    return { subtotal, discountCut, total };
  }, [items, promo]);

  return (
    <div className="space-y-6 sticky top-28">
      <OrderSummary
        subtotal={subtotal}
        discountCut={discountCut}
        total={total}
      />
    </div>
  );
}
