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
