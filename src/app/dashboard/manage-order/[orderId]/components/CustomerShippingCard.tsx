import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { AdminOrderDetail } from "@/components/types";

interface CustomerShippingCardProps {
  customer: AdminOrderDetail["customer"];
  shipping: AdminOrderDetail["shipping"];
}

export default function CustomerShippingCard({
  customer,
  shipping,
}: CustomerShippingCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3">
        <User className="w-5 h-5 text-gray-500" />
        <CardTitle className="text-lg">Customer & Shipping</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="grid grid-cols-[100px_1fr]">
          <span className="text-gray-500">Name</span>
          <span className="font-semibold">{customer.name}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr]">
          <span className="text-gray-500">Phone</span>
          <span>{customer.phone || "N/A"}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr]">
          <span className="text-gray-500">Address</span>
          <span className="leading-relaxed">{shipping.address}</span>
        </div>
      </CardContent>
    </Card>
  );
}