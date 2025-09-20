import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
import { OrderDetail } from "@/components/types";

interface OrderDetailState {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
  fetchOrder: (orderId: number) => Promise<void>;
}

export const useOrderDetailStore = create<OrderDetailState>((set) => ({
  order: null,
  loading: true,
  error: null,

  fetchOrder: async (orderId) => {
    set({ loading: true, error: null, order: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ loading: false, error: "Authentication required." });
      return;
    }

    try {
      const response = await apiCall.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ order: response.data.data, loading: false });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch order details.";
      toast.error(errorMsg);
      set({ error: errorMsg, loading: false });
    }
  },
}));
