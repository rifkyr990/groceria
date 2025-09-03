"use client";

import { useState } from "react";
import CartList from "@/components/cart/CartList";
import CheckoutSection from "@/components/cart/CheckoutSection";
import { mockCartItems } from "@/components/cart/dummy-data/Data-CartItem";
import { CartItemProps } from "@/components/types";

export default function ComponentTest() {
  const [items, setItems] = useState<CartItemProps[]>(mockCartItems);

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
        <CheckoutSection items={items} />
      </div>
    </section>
  );
}
