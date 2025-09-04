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
    <div className="space-y-8">
      <div className="flex justify-between items-baseline">
        <h1 className="text-3xl font-bold text-text-dark">Your Cart</h1>
        <a
          href="#"
          className="text-sm font-semibold text-primary-green-600 hover:text-primary-green-700 hover:underline"
        >
          Continue Shopping
        </a>
      </div>

      <Card className="shadow-lg shadow-gray-200/50">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-gray-200 pb-4">
          <IoStorefrontOutline className="text-xl text-primary-green-600" />
          <CardTitle className="text-lg font-semibold text-text-dark">
            Items from{" "}
            <span className="text-primary-green-600">MarketIpsum</span> (
            {items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
