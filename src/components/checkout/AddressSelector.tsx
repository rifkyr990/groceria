"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddNewAddressModal from "./AddNewAddressModal";
import { UserAddress } from "../types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Mock data or dummy for user addresses
const mockAddresses: UserAddress[] = [
  {
    id: 1,
    name: "John Doe",
    phone: "081234567890",
    label: "Home",
    province: "DKI Jakarta",
    city: "Jakarta Pusat",
    district: "Gambir",
    postalCode: "10110",
    street: "Jl. Merdeka No. 123",
    isPrimary: true,
  },
  {
    id: 2,
    name: "John Doe",
    phone: "089876543210",
    label: "Office",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    district: "Kuningan",
    postalCode: "12710",
    street: "Gedung Cyber, Jl. Kuningan Barat No. 8",
    isPrimary: false,
  },
];

interface AddressSelectorProps {
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
}

export default function AddressSelector({
  selectedAddressId,
  setSelectedAddressId,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<UserAddress[]>(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set initial address selection when component mounts
  useState(() => {
    if (!selectedAddressId) {
      const primaryAddress = mockAddresses.find((addr) => addr.isPrimary);
      if (primaryAddress) {
        setSelectedAddressId(primaryAddress.id);
      }
    }
  });

  const handleAddressAdded = (newAddressData: Omit<UserAddress, "id">) => {
    const newAddress: UserAddress = {
      id: Date.now(),
      ...newAddressData,
    };

    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
          <CardTitle className="text-base sm:text-lg font-bold">
            Delivery Address
          </CardTitle>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        <RadioGroup
          value={selectedAddressId?.toString()}
          onValueChange={(value) => setSelectedAddressId(Number(value))}
        >
          <div className="space-y-3">
            {addresses.map((address) => (
              <Label
                key={address.id}
                htmlFor={`addr-${address.id}`}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                  selectedAddressId === address.id
                    ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem
                  value={address.id.toString()}
                  id={`addr-${address.id}`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800">
                      {address.label}
                    </p>
                    {address.isPrimary && (
                      <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-700 text-sm mt-1">
                    {address.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {address.street}, {address.district}, {address.city},{" "}
                    {address.province} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                </div>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>

    <AddNewAddressModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      onAddressAdded={handleAddressAdded}
    />
    </>
  );
}