import { apiCall } from "@/helper/apiCall";
// import { mockPromoCodes } from "@/components/cart/dummy-data/Data-Promo";
import { PromoCode } from "@/components/types";
import { AxiosError } from "axios";

const mockPromoCodes: PromoCode[] = [
  {
    code: "HEMAT10",
    description: "Discount 10,000 for any purchase",
    type: "fixed",
    value: 10000,
  },
];
import { create } from "zustand";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: string;
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
    price: string;
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
    product: Omit<CartItem, "quantity" | "id"> & { id: number },
    storeId: number,
    storeName: string,
    quantity?: number
  ) => void;
  incrementItem: (cartItemId: number) => void;
  decrementItem: (cartItemId: number) => void;
  removeItem: (cartItemId: number) => void;

  removePromoCode: () => void;
  clearCart: () => void;

  fetchCart: (token: string | null) => Promise<void>;
  saveCart: (token: string | null) => Promise<void>;
  hydratePromo: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  storeId: null,
  storeName: null,
  items: [],
  appliedPromo: null,
  loading: false,
  error: null,

  promoCodes: mockPromoCodes, // mock data

  addItem: (product, storeId, storeName, quantity = 1) =>
    set((state) => {
      const isNewStore = state.storeId !== null && state.storeId !== storeId;

      if (isNewStore) {
        toast.info(`Cart cleared. Now shopping at ${storeName}.`);
      }

      const initialItems = isNewStore ? [] : state.items;

      const existing = initialItems.find(
        (item) => item.productId === product.id
      );

      let updatedItems;
      if (existing) {
        updatedItems = initialItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // When adding a new item, we don't have a cartItem.id from DB yet.
        // We use a temporary ID like Date.now() for React key prop stability.
        // The real ID will be assigned when fetched from the backend after saving.
        const newItem = {
          ...product,
          id: Date.now(),
          productId: product.id,
          quantity,
        };
        updatedItems = [...initialItems, newItem];
      }

      toast.success(`${product.name} added to cart`);

      const newState = {
        storeId,
        storeName,
        items: updatedItems,
        appliedPromo: isNewStore ? null : state.appliedPromo,
      };

      // Immediately trigger a save after updating the state.
      setTimeout(() => {
        const { token } = useAuthStore.getState();
        if (token) {
          get().saveCart(token);
        }
      }, 0);

      return newState;
    }),

  incrementItem: (cartItemId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      // Trigger save
      setTimeout(() => {
        const { token } = useAuthStore.getState();
        if (token) get().saveCart(token);
      }, 0);
      return { items: updatedItems };
    }),

  decrementItem: (cartItemId) =>
    set((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
      // Trigger save
      setTimeout(() => {
        const { token } = useAuthStore.getState();
        if (token) get().saveCart(token);
      }, 0);
      return { items: updatedItems };
    }),

  removeItem: (cartItemId) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== cartItemId);
      // Trigger save
      setTimeout(() => {
        const { token } = useAuthStore.getState();
        if (token) get().saveCart(token);
      }, 0);
      return { items: updatedItems };
    }),

  tryApplyPromoCode: (code) => {
    const { promoCodes } = get();
    const codeToApply = code.trim().toLowerCase();
    const found = promoCodes.find((p) => p.code.toLowerCase() === codeToApply);

    if (found) {
      localStorage.setItem("applied_promo", found.code);
      set({ appliedPromo: found.code });
      return true;
    } else {
      localStorage.removeItem("applied_promo");
      set({ appliedPromo: null });
      return false;
    }
  },

  removePromoCode: () => {
    localStorage.removeItem("applied_promo");
    set({ appliedPromo: null });
  },

  clearCart: () => {
    localStorage.removeItem("applied_promo");
    set({
      storeId: null,
      items: [],
      appliedPromo: null,
    });
  },

  hydratePromo: () => {
    const savedPromo = localStorage.getItem("applied_promo");
    if (savedPromo) {
      set({ appliedPromo: savedPromo });
    }
  },

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
          price: item.product.price, // Now a string from API
          quantity: item.quantity,
          image: item.product.imageUrl,
        })),
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
