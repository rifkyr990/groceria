export interface CartItemProps {
  id: string;
  name: string;
  details: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartItemComponentProps extends CartItemProps {
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export interface CartListProps {
  items: CartItemProps[];
  onDecrement: (id: string) => void;
  onIncrement: (id: string) => void;
  onRemove: (id: string) => void;
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
