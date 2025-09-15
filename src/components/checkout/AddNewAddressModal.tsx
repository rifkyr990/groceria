"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddressStore } from "@/store/address-store";
import { Loader2 } from "lucide-react";
import MapPicker from "../MapPickerWrapper";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AddNewAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface AddressFormData {
  label: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postal_code: string;
  is_primary: boolean;
  detail: string;
  latitude: number | null;
  longitude: number | null;
}

export default function AddNewAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddNewAddressModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { addAddress, loading } = useAddressStore();
  const initialFormState: AddressFormData = {
    label: "",
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    street: "",
    postal_code: "",
    is_primary: false,
    detail: "",
    latitude: null,
    longitude: null,
  };
  const [form, setForm] = useState<AddressFormData>(initialFormState);

  const handleLocationSelect = (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      street: data.road,
      city: data.city,
      province: data.province,
      latitude: data.lat,
      longitude: data.long,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, is_primary: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(form);
    if (success) {
      setForm(initialFormState);
      onSuccess();
    }
  };

  const AddressFormContent = () => (
    <div className="space-y-4">
      <div className="h-[150px] w-full bg-gray-200 rounded-lg overflow-hidden">
        <MapPicker onLocationSelect={handleLocationSelect} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={form.label}
          onChange={handleChange}
          placeholder="Enter label"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Recipient Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter recipient's full name"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="province">Province</Label>
          <Input
            id="province"
            value={form.province}
            onChange={handleChange}
            placeholder="Enter province name"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={form.district}
            onChange={handleChange}
            placeholder="Enter district"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Enter postal code"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="street">Street Address</Label>
        <Textarea
          id="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Enter Address"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="detail">{"Address Detail (Optional)"}</Label>
        <Input
          id="detail"
          value={form.detail || ""}
          onChange={handleChange}
          placeholder="Enter detail"
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="is_primary"
          checked={form.is_primary}
          onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
        />
        <Label htmlFor="is_primary">Set as primary address</Label>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Pin your location on the map or fill in the details manually.
            </DialogDescription>
          </DialogHeader>
          <form id="address-form-desktop" onSubmit={handleSubmit}>
            <div className="py-4 max-h-[60vh] pr-4">
              <AddressFormContent />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="address-form-desktop"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Address</DrawerTitle>
          <DrawerDescription>
            Pin your location on the map or fill in the details manually.
          </DrawerDescription>
        </DrawerHeader>
        <form
          id="address-form-mobile"
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto"
        >
          <div className="p-4 px-8 pt-0">
            <AddressFormContent />
          </div>
        </form>
        <DrawerFooter className="pt-2">
          <Button type="submit" form="address-form-mobile" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Address
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
