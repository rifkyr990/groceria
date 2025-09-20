import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductStore = {
  products: IProductProps[];
  getProductList: () => Promise<void>;
  selectedProductDetails: IProductProps | null;
  setSelectedProductDetails: (product: IProductProps) => void;
  productsByLoc: IProductProps[];
  setProductsByLoc: (data: IProductProps[]) => void;
  getProductById: (id: number) => Promise<void>;
};

export const useProduct = create<ProductStore>()(
  persist(
    (set) => ({
      products: [] as IProductProps[],
      productsByLoc: [] as IProductProps[],
      selectedProductDetails: null,
      getProductList: async () => {
        try {
          const res = await apiCall.get("/api/product/all");
          set({ products: res.data.data });
        } catch (error) {
          console.log(error);
        }
      },
      setSelectedProductDetails: (product) =>
        set({ selectedProductDetails: product }),
      getProductById: async (id: number) => {
        try {
          const res = await apiCall.get(`/api/product/detail/${id}`);
          set({ selectedProductDetails: res.data.data });
        } catch (error) {
          console.error("Gagal fetch product by id:", error);
        }
      },
      setProductsByLoc: (data: IProductProps[]) => set({ productsByLoc: data }),
    }),

    {
      name: "product-store",
      partialize: (state) => ({
        selectedProductDetails: state.selectedProductDetails,
        productsByLoc: state.productsByLoc,
      }),
    }
  )
);
