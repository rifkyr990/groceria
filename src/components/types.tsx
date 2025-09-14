export interface UserAddress {
  id: number;
  name: string;
  phone: string;
  label: string;
  province: string;
  city: string;
  district: string;
  subdistrict?: string | null;
  postalCode: string;
  street: string;
  detail?: string | null;
  isPrimary: boolean;
}

export interface ShippingOption {
  id: number;
  courier: string;
  service: string;
  cost: number;
  estimated: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

export interface CartItemProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartItemComponentProps extends CartItemProps {
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}

export interface CartListProps {
  items: CartItemProps[];
  storeName?: string | null;
  onDecrement: (id: number) => void;
  onIncrement: (id: number) => void;
  onRemove: (id: number) => void;
}

export interface PromoCode {
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
}

export interface CheckoutSectionProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  promoInputText: string;
  promoStatus: "idle" | "invalid";
  promoCodes: PromoCode[];
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  onPromoInputChange: (value: string) => void;
}

export interface PromoInputProps {
  inputText: string;
  status: "idle" | "invalid";
  appliedPromo: PromoCode | null;
  promoCodes: PromoCode[];
  onInputChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}
