"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileForm from "./profile-form";
import AddressForm from "./address-form";
import PasswordForm from "./password-form";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<
        "profile" | "address" | "password"
    >("profile");

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar full width dan tidak mengkerut */}
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
