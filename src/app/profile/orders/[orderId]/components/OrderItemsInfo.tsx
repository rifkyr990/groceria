import Image from "next/image";
import { OrderItemDetail } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";
import { ClipboardList } from "lucide-react";

interface OrderItemsInfoProps {
  items: OrderItemDetail[];
}

export default function OrderItemsInfo({ items }: OrderItemsInfoProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-gray-500" />
        Items Ordered
      </h3>
      <div className="border border-dashed border-gray-300 rounded-xl p-4">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={56}
                height={56}
                className="w-14 h-14 object-cover rounded-lg border bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x {formatIDRCurrency(Number(item.priceAtPurchase))}
                </p>
              </div>
              <p className="font-semibold text-sm text-gray-800 text-right">
                {formatIDRCurrency(item.quantity * Number(item.priceAtPurchase))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}