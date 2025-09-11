"use client";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { IProductProps } from "@/types/product";
import { use, useEffect, useState } from "react";
import DesktopPrdDetails from "../components/DekstopPrdDetails";
import MobilePrdDetails from "../components/MobilePrdDetails";

interface IProductDetailPageProps {
  params: Promise<{ id: number }>;
}

export default function ProductDetailPage({ params }: IProductDetailPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<IProductProps | null>(null);
  const [allProduct, setAllProduct] = useState<IProductProps[] | null>([]);
  const getDetail = async () => {
    try {
      const res = await fetch(`/api/products`);
      const data: IProductProps[] = await res.json();
      console.log(data);
      const result = data.find((item) => item.id === Number(id));
      console.log(typeof id);
      console.log(result);

      if (result) {
        setProduct(result);
        setAllProduct(data);
      } else {
        alert("Product Data Not Found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

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
