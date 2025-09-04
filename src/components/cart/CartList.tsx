"use client";

import { IoStorefrontOutline } from "react-icons/io5";
import CartItem from "./CartItem";
import { CartItemProps, CartListProps } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CartList({
  items,
  onDecrement,
  onIncrement,
  onRemove,
}: CartListProps) {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">
          Your Cart
        </h1>
        <a
          href="#"
          className="text-sm font-semibold text-primary-green-600 hover:text-primary-green-700 hover:underline self-start sm:self-auto"
        >
          Continue Shopping
        </a>
      </div>

      <Card className="shadow-lg shadow-gray-200/50 border-0">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 pb-3 sm:pb-4 px-3 sm:px-6">
          <IoStorefrontOutline className="text-lg sm:text-xl text-primary-green-600 flex-shrink-0" />
          <CardTitle className="text-base sm:text-lg font-semibold text-text-dark">
            Items from{" "}
            <span className="text-primary-green-600">MarketIpsum</span> (
            {items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {items.map((item: CartItemProps) => (
            <CartItem
              key={item.id}
              {...item}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
              onRemove={onRemove}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
