import { IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface QuantityIncrementerProps {
  id: string;
  quantity: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export default function QuantityIncrementer({
  id,
  quantity,
  onIncrement,
  onDecrement,
}: QuantityIncrementerProps) {
  return (
    <div
      className="flex items-center border border-gray-300 rounded-lg overflow-hidden
                 transition-all hover:border-primary-green-500 hover:ring-1 hover:ring-primary-green-500"
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors
                   hover:bg-primary-green-100 hover:text-primary-green-700"
        onClick={() => onDecrement(id)}
      >
        <IoRemoveOutline className="text-lg" />
      </Button>

      <span className="px-4 font-semibold text-text-dark">{quantity}</span>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors
                   hover:bg-primary-green-100 hover:text-primary-green-700"
        onClick={() => onIncrement(id)}
      >
        <IoAddOutline className="text-lg" />
      </Button>
    </div>
  );
}
