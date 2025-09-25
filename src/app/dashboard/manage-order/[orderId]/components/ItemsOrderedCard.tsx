import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { AdminOrderItem } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";

interface ItemsOrderedCardProps {
  items: AdminOrderItem[];
}

export default function ItemsOrderedCard({ items }: ItemsOrderedCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3">
        <ClipboardList className="w-5 h-5 text-gray-500" />
        <CardTitle className="text-lg">Items Ordered</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={56}
                height={56}
                className="w-14 h-14 object-cover rounded-lg border bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x {formatIDRCurrency(Number(item.price))}
                </p>
              </div>
              <p className="font-semibold text-sm text-gray-800 text-right">
                {formatIDRCurrency(item.quantity * Number(item.price))}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}