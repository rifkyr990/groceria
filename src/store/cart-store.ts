import { create } from "zustand";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
}

interface ApiCartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: string | number;
    imageUrl: string;
  };
}

interface ApiCartResponse {
  storeId: number;
  cartItems: ApiCartItem[];
  appliedPromo?: string;
}

interface CartState {
  storeId: number | null;
  items: CartItem[];
  appliedPromo: string | null;

  addItem: (
    product: Omit<CartItem, "quantity">,
    storeId: number,
    quantity?: number
  ) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, newQuantity: number) => void;
  applyPromoCode: (promoCode: string) => void;
  removePromoCode: () => void;
  clearCart: () => void;

  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  storeId: null,
  items: [],
  appliedPromo: null,

  addItem: (product, storeId, quantity = 1) =>
    set((state) => {
      const isNewStore = state.storeId !== null && state.storeId !== storeId;

      const initialItems = isNewStore ? [] : state.items;

      const existing = initialItems.find((item) => item.id === product.id);

      let updatedItems;
      if (existing) {
        updatedItems = initialItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...initialItems, { ...product, quantity }];
      }

      return {
        storeId,
        items: updatedItems,
        appliedPromo: isNewStore ? null : state.appliedPromo,
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  updateItemQuantity: (productId, newQuantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      ),
    })),

  applyPromoCode: (promo) =>
    set(() => ({
      appliedPromo: promo,
    })),

  removePromoCode: () =>
    set(() => ({
      appliedPromo: null,
    })),

  clearCart: () =>
    set(() => ({
      storeId: null,
      items: [],
      appliedPromo: null,
    })),

  fetchCart: async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data: ApiCartResponse = await response.json();

      set({
        storeId: data.storeId,
        items: data.cartItems.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: Number(item.product.price),
          quantity: item.quantity,
          image: item.product.imageUrl,
        })),
        appliedPromo: data.appliedPromo ?? null,
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  },
}));
