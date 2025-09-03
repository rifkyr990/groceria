"use client";
import { IoStorefrontOutline } from "react-icons/io5";
import CartItem from "./CartItem";
import { CartItemProps, CartListProps } from "../types";

export default function CartList(data: CartListProps) {
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

      <section className="bg-surface rounded-2xl shadow-lg shadow-gray-200/50 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <IoStorefrontOutline className="text-xl text-primary-green-600"></IoStorefrontOutline>
          <h2 className="text-lg font-semibold text-text-dark">
            Items from{" "}
            <span className="text-primary-green-600">
              Groceria Central Market
            </span>{" "}
            (2)
          </h2>
        </div>

        {data.items.map((item: CartItemProps) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            details={item.details}
            price={item.price}
            image={item.image}
            quantity={item.quantity}
            onDecrement={data.onDecrement}
            onIncrement={data.onIncrement}
            onRemove={data.onRemove}
          />
        ))}
      </section>
    </div>
  );
}
