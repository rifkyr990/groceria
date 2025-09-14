import { apiCall } from "@/helper/apiCall";
import { mockPromoCodes } from "@/components/cart/dummy-data/Data-Promo";
import { PromoCode } from "@/components/types";
import { AxiosError } from "axios";
import { create } from "zustand";
import { useAuthStore } from "./auth-store";

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

  fetchCart: (token: string | null) => Promise<void>;
  saveCart: (token: string | null) => Promise<void>;
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

  fetchCart: async (token: string | null) => {
    if (!token) {
      set({ items: [], storeId: null, storeName: null, loading: false });
      return;
    }
    set({ loading: true, error: null });

    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const response = await apiCall.get("/api/cart", authHeader);

      const data: ApiCartResponse = response.data.data;

      set({
        storeId: data.store?.id || null,
        storeName: data.store?.name || null,
        items: (data.cartItems || []).map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: Number(item.product.price),
          quantity: item.quantity,
          image: item.product.imageUrl,
        })),
        appliedPromo: null, // will be handled later
        loading: false,
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.status !== 401 && error.response?.status !== 404) {
        set({
          error: error.response?.data?.error || "Failed to fetch cart",
          loading: false,
        });
      } else {
        set({
          loading: false,
          error: error.response?.data?.error || "Failed to fetch cart",
        });
      }
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

      const token = useAuthStore.getState().token;

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      await apiCall.put("/api/cart", payload, authHeader);

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
