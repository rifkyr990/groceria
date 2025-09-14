import { apiCall } from "@/helper/apiCall";
import { mockPromoCodes } from "@/components/cart/dummy-data/Data-Promo";
import { PromoCode } from "@/components/types";
import { AxiosError } from "axios";
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
  store: { name: string; id: number };
  cartItems: ApiCartItem[];
  appliedPromo?: string;
}

interface ApiError {
  error: string;
}

interface CartState {
  storeId: number | null;
  storeName: string | null;
  items: CartItem[];
  appliedPromo: string | null;
  promoCodes: PromoCode[];
  tryApplyPromoCode: (code: string) => boolean;
  loading: boolean;
  error: string | null;

  addItem: (
    product: Omit<CartItem, "quantity">,
    storeId: number,
    quantity?: number
  ) => void;
  incrementItem: (productId: number) => void;
  decrementItem: (productId: number) => void;
  removeItem: (productId: number) => void;

  removePromoCode: () => void;
  clearCart: () => void;

  fetchCart: () => Promise<void>;
  saveCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  storeId: null,
  storeName: null,
  items: [],
  appliedPromo: null,
  loading: false,
  error: null,

  promoCodes: mockPromoCodes, // mock data

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

  incrementItem: (productId) =>
    set({
      items: get().items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }),

  decrementItem: (productId) =>
    set({
      items: get().items.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      ),
    }),

  removeItem: (productId) =>
    set({
      items: get().items.filter((item) => item.id !== productId),
    }),

  tryApplyPromoCode: (code) => {
    const { promoCodes } = get();
    const codeToApply = code.trim().toLowerCase();

    const found = promoCodes.find((p) => p.code.toLowerCase() === codeToApply);

    if (found) {
      set({ appliedPromo: found.code });
      return true;
    } else {
      set({ appliedPromo: null });
      return false;
    }
  },

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
    set({ loading: true, error: null });
    try {
      const response = await apiCall.get("/api/cart");
      const data: ApiCartResponse = response.data;

      set({
        storeId: data.store.id,
        storeName: data.store.name,
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
        loading: false,
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      set({
        error: error.response?.data?.error || "Failed to fetch cart",
        loading: false,
      });
    }
  },
  saveCart: async () => {
    set({ loading: true, error: null });
    try {
      const { storeId, items } = get();

      if (!storeId) {
        console.warn("Cannot save cart without a storeId.");
        set({ loading: false });
        return;
      }

      const payload = {
        storeId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await apiCall.put("/api/cart", payload);

      set({ loading: false });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      set({
        error: error.response?.data?.error || "Failed to save cart",
        loading: false,
      });
    }
  },
}));
