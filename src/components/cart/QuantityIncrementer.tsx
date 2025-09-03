"use client";
import { IoRemoveOutline, IoAddOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function QuantityIncrementer({
  quantity,
  onIncrement,
  onDecrement,
}: Props) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className="w-10 h-10 flex items-center justify-center 
                   text-gray-500 hover:text-primary-green-600 active:text-primary-green-800
                   hover:bg-primary-green-50 active:bg-primary-green-100
                   transition-colors"
      >
        <IoRemoveOutline className="text-lg" />
      </button>

      <span className="px-4 font-semibold text-text-dark">{quantity}</span>

      <button
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="w-10 h-10 flex items-center justify-center 
                   text-gray-500 hover:text-primary-green-600 active:text-primary-green-800
                   hover:bg-primary-green-50 active:bg-primary-green-100
                   transition-colors"
      >
        <IoAddOutline className="text-lg" />
      </button>
    </div>
  );
}
