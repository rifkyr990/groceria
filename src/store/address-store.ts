import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
import { UserAddress } from "@/components/types";

type NewAddressData = Omit<UserAddress, "id">;

interface AddressFormValues {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  street: string;
  detail: string;
  label: "RUMAH" | "KANTOR";
  is_primary: boolean;
}

// sesuai schema prisma
interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  street: string;
  detail: string;
  label: "RUMAH" | "KANTOR";
  is_primary: boolean;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddress: () => Promise<void>;
  addAddress: (data: AddressFormValues) => Promise<boolean>;
  updateAddress: (id: number, data: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: number) => Promise<void>;
  setPrimary: (id: number) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddress: async () => {
    try {
      set({ loading: true });
      const res = await apiCall.get("/api/address");
      set({ addresses: res.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Gagal mengambil alamat",
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
      await get().fetchAddress();
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

  updateAddress: async (id, data) => {
    try {
      const res = await apiCall.put(`/api/address/${id}`, data);
      set({
        addresses: get().addresses.map((addr) =>
          addr.id === id ? res.data.data : addr
        ),
      });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Gagal update alamat",
      });
      return false;
    }
  },

  deleteAddress: async (id) => {
    try {
      await apiCall.delete(`/api/address/${id}`);
      set({
        addresses: get().addresses.filter((addr) => addr.id !== id),
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Gagal hapus alamat",
      });
    }
  },

  setPrimary: async (id) => {
    try {
      const res = await apiCall.patch(`/api/address/${id}/primary`);
      set({
        addresses: get().addresses.map((addr) =>
          addr.id === id ? res.data.data : { ...addr, is_primary: false }
        ),
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Gagal set alamat utama",
      });
    }
  },
}));
