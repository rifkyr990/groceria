import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { create } from "zustand";

type ProductStore = {
  products: IProductProps[];
  getProductList: () => Promise<void>;
  selectedProductDetails: IProductProps | null;
  setSelectedProductDetails: (product: IProductProps) => void;
};

export const useProduct = create<ProductStore>((set) => ({
  products: [] as IProductProps[],
  selectedProductDetails: null,
  getProductList: async () => {
    try {
      const res = await apiCall.get("/api/product/all");
      //   console.log(res.data.data);
      set({ products: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },
  setSelectedProductDetails: (product) =>
    set({ selectedProductDetails: product }),
}));
