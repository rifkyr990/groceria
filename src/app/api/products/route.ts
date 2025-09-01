import { NextResponse } from "next/server";

const products = [
    { id: 1, name: "Apel Malang", price: 25000, image: "", province: "Jawa Timur", category: "buah" },
    { id: 2, name: "Pisang Ambon", price: 20000, image: "/assets/produk/pisang.jpg", province: "Jawa Barat", category: "buah" },
    { id: 3, name: "Anggur Hijau", price: 10000, image: "/assets/produk/anggur-hijau.jpg", province: "Jawa Barat", category: "buah" },
    { id: 4, name: "Bayam Segar", price: 15000, image: "/assets/produk/bayam.jpg", province: "DKI Jakarta", category: "sayur" },
    { id: 5, name: "Tomat Merah", price: 18000, image: "", province: "Jawa Timur", category: "sayur" },
    { id: 6, name: "Jeruk Sunkis", price: 22000, image: "/assets/produk/jeruk.jpg", province: "Jawa Barat", category: "buah" },
    { id: 7, name: "Wortel Segar", price: 17000, image: "", province: "Jawa Tengah", category: "sayur" },
    { id: 8, name: "Ayam Kampung", price: 55000, image: "/assets/produk/dada-ayam.jpeg", province: "Jawa Timur", category: "daging" },
    { id: 9, name: "Bawang Merah", price: 11000, image: "/assets/produk/bawang-merah.jpg", province: "Jawa Barat", category: "sayur" },
    { id: 10, name: "Tomat", price: 9000, image: "/assets/produk/tomat.jpg", province: "Jawa Barat", category: "sayur" },
    { id: 11, name: "Bayam", price: 4000, image: "/assets/produk/bayam.jpg", province: "Jawa Barat", category: "sayur" },
    { id: 12, name: "Daging Sapi", price: 110000, image: "/assets/produk/daging.png", province: "Jawa Barat", category: "daging" },
    { id: 13, name: "Dada Ayam", price: 34000, image: "/assets/produk/dada-ayam.jpeg", province: "Jawa Barat", category: "daging" },
    { id: 14, name: "Daging Kambing Muda", price: 90000, image: "/assets/produk/daging-kambing.jpg", province: "Jawa Barat", category: "daging" },
];

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const province = searchParams.get("province");
    const category = searchParams.get("category");

    let filtered = products;

    if (province) {
        filtered = filtered.filter((p) => p.province === province);
    }

    // filter berdasarkan kategori
    if (category) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json(filtered.length > 0 ? filtered : products);
}
