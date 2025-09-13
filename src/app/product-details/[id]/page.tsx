"use client";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { IProductProps } from "@/types/product";
import { use, useEffect, useState } from "react";
import DesktopPrdDetails from "../components/DekstopPrdDetails";
import MobilePrdDetails from "../components/MobilePrdDetails";
import { useProduct } from "@/store/useProduct";
import { useLocationStore } from "@/store/use-location-store";
import { apiCall } from "@/helper/apiCall";

interface IProductDetailPageProps {
  params: Promise<{ id: number }>;
}

export default function ProductDetailPage({ params }: IProductDetailPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<IProductProps | null>(null);
  const [allProduct, setAllProduct] = useState<IProductProps[] | null>([]);
  const { products, getProductList, selectedProductDetails } = useProduct();
  const { city, province, latitude, longitude } = useLocationStore();
  console.log(id);
  // const getDetail = async () => {
  //   try {
  //     const res = await fetch(`/api/products`);
  //     const data: IProductProps[] = await res.json();
  //     console.log(data);
  //     const result = data.find((item) => item.id === Number(id));
  //     console.log(typeof id);
  //     console.log(result);

  //     if (result) {
  //       setProduct(result);
  //       setAllProduct(data);
  //     } else {
  //       alert("Product Data Not Found");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!selectedProductDetails) {
      const fetchProduct = async () => {
        try {
          const url =
            province && city
              ? `/api/product?province=${encodeURIComponent(province)}&city=${encodeURIComponent(city)}${latitude && longitude ? `&lat=${latitude}&long=${longitude}` : ""}`
              : `/api/product/all`;

          const res = await apiCall.get(url);
          const result = res.data.data;
          setAllProduct(result);
          // find details product by id
          const found = allProduct?.find((p) => p.id === Number(id));
          if (found) {
            setProduct(found);
          } else {
            console.log("Product Not Found");
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchProduct();
    } else {
      setProduct(selectedProductDetails);
    }
  }, [selectedProductDetails, id, province, city, latitude, longitude]);

  return (
    <section>
      <Navbar />
      <DesktopPrdDetails
        allProduct={allProduct}
        detailsData={product}
        className="max-sm:hidden "
      />
      <MobilePrdDetails
        allProduct={allProduct}
        detailsData={product}
        className="sm:hidden "
      />

      <footer>
        <Footer />
      </footer>
    </section>
  );
}
