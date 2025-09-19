"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemProps, PromoCode } from "../types";

interface PaymentSummaryProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  shippingCost: string;
}

export default function PaymentSummary({
  items,
  appliedPromo,
  shippingCost,
}: PaymentSummaryProps) {
  const { subtotal, discountCut, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const discountCut = appliedPromo
      ? appliedPromo.type === "percentage"
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value
      : 0;
    const total = Math.max(0, subtotal - discountCut + Number(shippingCost));
    return { subtotal, discountCut, total };
  }, [items, appliedPromo, shippingCost]);

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-bold">
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium">{formatIDRCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Shipping cost</span>
          <span className="font-medium">{formatIDRCurrency(shippingCost)}</span>
        </div>

        {typeof discountCut === "number" && discountCut > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">
              - {formatIDRCurrency(discountCut)}
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-2"></div>

        <div className="flex justify-between text-base font-bold text-gray-800">
          <span>Total</span>
          <span aria-live="polite">{formatIDRCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
