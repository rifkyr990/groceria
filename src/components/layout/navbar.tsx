// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingCart, Sun, Moon, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between bg-white dark:bg-gray-900">

            <div className="flex items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <span className="text-xl font-bold text-green-600">Groceria</span>
            </div>

            <ul className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-200">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/stores">Stores</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>

            <div className="flex items-center gap-4">
                {/* Lokasi */}
                {/* <div className="flex items-center gap-1 text-gray-600 dark:text-gray-200">
                    <MapPin className="w-5 h-5" />
                    <span>Location</span>
                </div> */}

                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {theme === "light" ? (
                        <Moon className="w-5 h-5 text-gray-600" />
                        ) : (
                        <Sun className="w-5 h-5 text-yellow-400" />
                        )}
                    </button>
                )}

                {/* Login */}
                <Link
                    href="/login"
                    className="text-gray-600 dark:text-gray-200 hover:underline"
                >
                    Login
                </Link>

                {/* Register */}
                <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                    Register
                </Link>
            </div>
        </nav>
    );
}
