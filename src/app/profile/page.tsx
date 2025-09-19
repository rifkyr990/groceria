"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import ProfileForm from "./profile-form";
import AddressForm from "./address-form";
import PasswordForm from "./password-form";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuthStore } from "@/store/auth-store"; // pastikan ini mengandung { user, hydrate }

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"profile" | "address" | "password">("profile");
    const { user, hydrate } = useAuthStore();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    // useEffect(() => {
    //     hydrate();
    // }, [hydrate]);

    // useEffect(() => {
    //     // Cek status autentikasi
    //     if (user === null) {
    //         router.replace("/");
    //     } else if (!user.is_verified) {
    //         router.replace("/");
    //     } else {
    //         setCheckingAuth(false);
    //     }
    // }, [user, router]);

    // if (checkingAuth) {
    //     return null;
    // }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full flex-shrink-0">
                <Navbar />
            </div>

            {/* Konten utama */}
            <div className="flex-1 max-w-7xl mx-auto p-6 flex gap-6 w-full">
                <aside className="w-64 sticky top-6 self-start h-fit">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </aside>
                <main className="flex-1">
                    {activeTab === "profile" && <ProfileForm />}
                    {activeTab === "address" && <AddressForm />}
                    {activeTab === "password" && <PasswordForm />}
                </main>
            </div>

            <div className="w-full flex-shrink-0">
                <Footer />
            </div>
        </div>
    );
}
