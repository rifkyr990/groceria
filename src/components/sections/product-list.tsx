"use client";
import Image from "next/image";
import { useLocationStore } from "@/store/use-location-store";
import { useEffect, useState } from "react";
import { ShoppingCart, Store } from "lucide-react";
import ProductDetailsPage from "@/app/product-details/[id]/page";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductList() {
  const { city, province } = useLocationStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 8;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = province
          ? `/api/products?province=${encodeURIComponent(province)}`
          : `/api/products`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Gagal fetch data", error);
      }
    }

    fetchProducts();
  }, [province]);

  useEffect(() => {
    if (selectedCategory === "semua") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
    setCurrentPage(1);
  }, [selectedCategory, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  function handleAddToCart(product: Product) {
    console.log("Tambah ke keranjang:", product);
  }
  // arco- start

  const router = useRouter();
  //   arco-end

  return (
    <section className="max-w-7xl mx-auto px-6 py-3 flex flex-col">
      <div className="flex items-center gap-2 my-6">
        <Store size={20} />
        <h2 className="text-xl font-bold">
          Produk Toko Terdekat{" "}
          {city && province ? `(${city}, ${province})` : ""}
        </h2>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["semua", "buah", "sayur", "daging", "lainnya"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              selectedCategory === cat
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white border-2 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col justify-center dark:bg-gray-800 dark:text-gray-200 "
            onClick={() => router.push(`/product-details/${product.id}`)}
          >
            <div className="relative w-full h-40 md:h-48 overflow-hidden ">
              <Image
                src={
                  product.image && product.image.trim() !== ""
                    ? product.image
                    : "/fallback.png"
                }
                alt={product.name || "Produk"}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-800 line-clamp-1 dark:text-gray-200">
                {product.name}
              </h3>
              <p className="text-green-600 font-bold mt-1">
                Rp {product.price.toLocaleString()}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-5 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition"
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">Tambah Keranjang</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border text-gray-700 bg-white disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200"
        >
          Sebelumnya
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === i + 1
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border text-gray-700 bg-white disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200"
        >
          Berikutnya
        </button>
      </div>
    </section>
  );
}
