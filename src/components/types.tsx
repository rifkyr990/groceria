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
