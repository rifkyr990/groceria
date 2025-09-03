"use client";

import { CartItemComponentProps } from "../types";
import QuantityIncrementer from "./QuantityIncrementer";
import RemoveButton from "./RemoveButton";

export default function CartItem({
  id,
  name,
  details,
  price,
  image,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemComponentProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-4 border-b border-gray-200">
      <img
        src={image}
        alt={name}
        className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-lg text-text-dark">{name}</h3>
            <p className="text-sm text-text-muted">{details}</p>
          </div>
          <p className="font-mono font-bold text-lg text-text-dark whitespace-nowrap">
            {formattedPrice}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <QuantityIncrementer
            quantity={quantity}
            onIncrement={() => onIncrement(id)}
            onDecrement={() => onDecrement(id)}
          />

          <div className="flex items-center gap-2 ml-auto">
            <RemoveButton onRemove={() => onRemove(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
