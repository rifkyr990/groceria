"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  activeTab: "profile" | "address" | "password";
  setActiveTab: (tab: "profile" | "address" | "password") => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-bold mb-4">Pengaturan</h2>
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeTab === "profile" && pathname === "/profile"
              ? "bg-green-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeTab === "address" && pathname === "/profile"
              ? "bg-green-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Alamat Saya
        </button>

        <Link
          href="/profile/orders"
          className={`block w-full text-left px-3 py-2 rounded ${
            pathname.startsWith("/profile/orders")
              ? "bg-green-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Pesanan Saya
        </Link>

        <button
          onClick={() => setActiveTab("password")}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeTab === "password" && pathname === "/profile"
              ? "bg-green-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Ubah Password
        </button>
      </nav>
    </aside>
  );
}
