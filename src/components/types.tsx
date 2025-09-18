export interface UserAddress {
  id: number;
  name: string;
  phone: string;
  label: string;
  province_id?: string | null;
  province: string;
  city_id?: string | null;
  city: string;
  district: string;
  subdistrict?: string | null;
  postal_code: string;
  street: string;
  detail?: string | null;
  is_primary: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  city_name: string;
  type: string;
  postal_code: string;
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

export interface OrderItemDetail {
  id: number;
  quantity: number;
  priceAtPurchase: string;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export interface OrderDetail {
  id: number;
  createdAt: string;
  totalPrice: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  destinationAddress: string;
  store: {
    id: number;
    name: string;
  };
  status: string;
  payment: {
    method: string;
    status: string;
  } | null;
  items: OrderItemDetail[];
}
