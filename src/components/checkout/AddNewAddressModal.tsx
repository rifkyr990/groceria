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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddressStore } from "@/store/address-store";
import { Loader2 } from "lucide-react";

interface AddNewAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddNewAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddNewAddressModalProps) {
  const { addAddress, loading } = useAddressStore();
  const initialFormState = {
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
  };
  const [form, setForm] = useState(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isPrimary: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(form);
    if (success) {
      setForm(initialFormState);
      onSuccess();
    }
  };

  const formFields = [
    { id: "label", label: "Label", placeholder: "e.g., Home, Office" },
    { id: "name", label: "Recipient Name", placeholder: "e.g., John Doe" },
    { id: "phone", label: "Phone Number", placeholder: "e.g., 0812..." },
    { id: "province", label: "Province", placeholder: "e.g., DKI Jakarta" },
    { id: "city", label: "City", placeholder: "e.g., Jakarta Pusat" },
    { id: "district", label: "District", placeholder: "e.g., Gambir" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter the details for your new delivery address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            {formFields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.id} className="text-right">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  value={form[field.id as keyof typeof form] as string}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="street" className="text-right pt-2">
                Street
              </Label>
              <Textarea
                id="street"
                value={form.street}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Jl. Merdeka No. 123..."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postalCode" className="text-right">
                Post Code
              </Label>
              <Input
                id="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g., 10110"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={form.is_primary}
                  onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
                />
                <Label htmlFor="isPrimary">Set as primary address</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
