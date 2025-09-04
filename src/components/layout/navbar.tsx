"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
    ShoppingCart,
    Sun,
    Moon,
    LogOut,
    Settings,
    LayoutDashboard,
    Menu as MenuIcon,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Menu, Transition } from "@headlessui/react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, logout } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const allowedRoles = ["TENANT", "STORE_ADMIN", "SUPER_ADMIN"];

    const NavLinks = () => (
        <>
            <li>
                <Link href="/">Home</Link>
            </li>
            <li>
                <Link href="/products">Products</Link>
            </li>
            <li>
                <Link href="/stores">Stores</Link>
            </li>
            <li>
                <Link href="/about">About Us</Link>
            </li>
            <li>
                <Link href="/contact">Contact</Link>
            </li>
        </>
    );

    return (
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between bg-white dark:bg-gray-900">
        {/* Logo */}
            <div className="flex items-center gap-2">
                <img src="/assets/logo-long.svg" alt="logo" className="w-40" />
            </div>

        {/* Menu utama (desktop) */}
        <ul className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-200">
            <NavLinks />
        </ul>

        {/* Kanan */}
        <div className="flex items-center gap-4">
            {/* Toggle Theme */}
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

            {/* Kalau belum login */}
            {!user ? (
            <div className="hidden md:flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-gray-600 dark:text-gray-200 hover:underline"
                    >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                    Register
                </Link>
            </div>
            ) : (
            /* Kalau sudah login */
            <Menu as="div" className="relative hidden md:block">
                <Menu.Button className="flex items-center gap-2 focus:outline-none">
                    <img
                        src={user.image_url || "/assets/user.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                        {user.first_name} {user.last_name}
                    </span>
                </Menu.Button>

                <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                    {allowedRoles.includes(user.role) && (
                        <Menu.Item>
                        {({ active }) => (
                            <Link
                            href="/dashboard"
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                                active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } text-gray-700 dark:text-gray-200`}
                            >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                        )}
                        </Menu.Item>
                    )}
                    <Menu.Item>
                        {({ active }) => (
                        <Link
                            href="/settings"
                            className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } text-gray-700 dark:text-gray-200`}
                        >
                            <Settings className="w-4 h-4" /> Pengaturan
                        </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                        <button
                            onClick={logout}
                            className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm ${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                            } text-gray-700 dark:text-gray-200`}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                        )}
                    </Menu.Item>
                    </div>
                </Menu.Items>
                </Transition>
            </Menu>
            )}

            {/* Mobile hamburger */}
            <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
            <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden z-50">
            <ul className="flex flex-col gap-4 px-6 py-4 text-gray-600 dark:text-gray-200">
                <NavLinks />
                {!user ? (
                <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Login
                    </Link>
                    <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold w-fit"
                        >
                        Register
                    </Link>
                </>
                ) : (
                <>
                    {allowedRoles.includes(user.role) && (
                    <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2"
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    )}
                    <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2"
                    >
                    <Settings className="w-4 h-4" /> Pengaturan
                    </Link>
                    <button
                    onClick={() => {
                        logout();
                        setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-left"
                    >
                    <LogOut className="w-4 h-4" /> Logout
                    </button>
                </>
                )}
            </ul>
            </div>
        )}
        </nav>
    );
}
