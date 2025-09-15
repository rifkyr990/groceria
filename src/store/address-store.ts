import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
import { UserAddress } from "@/components/types";

type NewAddressData = Omit<UserAddress, "id">;

interface AddressState {
  addresses: UserAddress[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: NewAddressData) => Promise<boolean>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;
    if (!token) return set({ loading: false, addresses: [] });

    try {
      const response = await apiCall.get("/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ addresses: response.data.data || [], loading: false });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch addresses");
      set({
        error: err.response?.data?.message || "Failed to fetch addresses",
        loading: false,
      });
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      toast.error("You must be logged in to add an address.");
      set({ loading: false });
      return false;
    }

    try {
      await apiCall.post("/api/address", addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refetch addresses to get the latest list including the new one
      await get().fetchAddresses();
      toast.success("Address added successfully!");
      set({ loading: false });
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add address");
      set({
        error: err.response?.data?.message || "Failed to add address",
        loading: false,
      });
      return false;
    }
  },
}));
