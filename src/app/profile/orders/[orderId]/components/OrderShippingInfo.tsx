import { OrderDetail } from "@/components/types";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrderShippingInfoProps {
  order: OrderDetail;
}

export default function OrderShippingInfo({ order }: OrderShippingInfoProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500" />
        Shipping Address
</h3>
        <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border space-y-2">
          <div className="grid grid-cols-[80px_1fr]">
            <span className="text-gray-500">Recipient</span>
            <span className="font-semibold">
              {order.destinationAddress.split(" (")[0]}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr]">
            <span className="text-gray-500">Phone</span>
            <span>{order.destinationAddress.match(/\(([^)]+)\)/)?.[1]}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr]">
            <span className="text-gray-500">Address</span>
            <span className="leading-relaxed">
              {order.destinationAddress.split("), ")[1]}
            </span>
        </div>
      </div>
    </div>
  );
}