"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShippingOption } from "../types";
import { formatIDRCurrency } from "@/utils/format";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shippingOptions: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelectOption: (option: ShippingOption | null) => void;
}

export default function ShippingMethodModal({
  open,
  onOpenChange,
  shippingOptions,
  selectedOption,
  onSelectOption,
}: ShippingMethodModalProps) {
  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Delivery Method</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedOption?.id.toString()}
            onValueChange={(value) => {
              const option =
                shippingOptions.find((o) => o.id.toString() === value) || null;
              onSelectOption(option);
            }}
          >
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={`ship-${option.id}`}
                  className={cn(
                    "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                    selectedOption?.id === option.id
                      ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`ship-${option.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        {option.courier} - {option.service}
                      </p>
                      <p className="font-bold text-gray-800">
                        {formatIDRCurrency(option.cost)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Truck className="w-4 h-4" />
                      <span>Est. arrival: {option.estimated}</span>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} className="w-full">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
