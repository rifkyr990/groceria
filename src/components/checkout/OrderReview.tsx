"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemProps, ShippingOption } from "@/components/types";

interface OrderReviewProps {
  items: CartItemProps[];
  storeName: string | null;
  selectedShipping: ShippingOption | null;
  onOpenModal: () => void;
}

export default function OrderReview({
  items,
  storeName,
  selectedShipping,
  onOpenModal,
}: OrderReviewProps) {
  const itemToShow = items[0];

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="px-4 pt-4 pb-3">
        <CardTitle className="text-base sm:text-lg font-bold">
          {storeName || "Your Items"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {itemToShow && (
          <div className="border border-dashed border-gray-300 rounded-xl p-3 flex items-center gap-3">
            <Image
              src={itemToShow.image}
              alt={itemToShow.name}
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800 truncate">
                {itemToShow.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatIDRCurrency(Number(itemToShow.price))} x{" "}
                {itemToShow.quantity}
              </p>
            </div>
            {items.length > 1 && (
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                + {items.length - 1} more
              </span>
            )}
          </div>
        )}

        <button
          onClick={onOpenModal}
          className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <p className="font-semibold text-gray-800">Delivery Methods</p>
          <div className="flex items-center gap-2">
            {selectedShipping ? (
              <span className="text-sm font-medium text-primary-green-600">
                {selectedShipping.courier} (
                {formatIDRCurrency(Number(selectedShipping.cost))})
              </span>
            ) : (
              <span className="text-sm text-gray-500">Select</span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
