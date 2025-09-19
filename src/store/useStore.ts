import { create } from "zustand";

interface IStoreState {
  selectedStore: string;
  setSelectedStore: (storeId: string) => void;
}

export const useStore = create<IStoreState>((set) => ({
  selectedStore: "all",
  setSelectedStore: (storeId) => set({ selectedStore: storeId }),
}));
