import Image from "next/image";
import { CartItemComponentProps } from "../types";
import QuantityIncrementer from "./QuantityIncrementer";
import RemoveButton from "./RemoveButton";
import { formatIDRCurrency } from "@/utils/format";

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
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-4 border-b border-gray-200 last:border-none">
      <Image
        src={image}
        alt={name}
        width={112}
        height={112}
        className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-lg text-text-dark">{name}</h3>
            <p className="text-sm text-text-muted">{details}</p>
          </div>
          <p className="font-bold text-lg text-text-dark whitespace-nowrap">
            {formatIDRCurrency(price)}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <QuantityIncrementer
            id={id}
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <div className="ml-auto">
            <RemoveButton id={id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}
