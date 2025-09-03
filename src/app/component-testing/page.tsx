"use client";
import { useState } from "react";
import CartItem from "@/components/cart/CartItem";
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
    <section className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          {...item}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      ))}
    </section>
  );
}
