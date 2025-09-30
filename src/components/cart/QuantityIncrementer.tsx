import { IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface QuantityIncrementerProps {
  id: number;
  quantity: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
}

export default function QuantityIncrementer({
  id,
  quantity,
  onIncrement,
  onDecrement,
}: QuantityIncrementerProps) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden transition-all hover:border-primary-green-500 hover:ring-1 hover:ring-primary-green-500">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors hover:bg-primary-green-100 hover:text-primary-green-700 h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => onDecrement(id)}
      >
        <IoRemoveOutline className="text-base sm:text-lg" />
      </Button>

      <span className="px-2 sm:px-4 font-semibold text-text-dark text-sm sm:text-base min-w-[2rem] sm:min-w-[2.5rem] text-center">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors hover:bg-primary-green-100 hover:text-primary-green-700 h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => onIncrement(id)}
      >
        <IoAddOutline className="text-base sm:text-lg" />
      </Button>
    </div>
  );
}
