import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { create } from "zustand";

type ProductStore = {
  products: IProductProps[];
  getProductList: () => Promise<void>;
};

export const useProduct = create<ProductStore>((set) => ({
  products: [] as IProductProps[],
  getProductList: async () => {
    try {
      const res = await apiCall.get("/api/product/all");
      //   console.log(res.data.data);
      set({ products: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },
}));
