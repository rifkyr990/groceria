"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "@/store/auth-store";
import PasswordInput from "@/components/PasswordInput";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const { verifyEmail, loading } = useAuthStore();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Token tidak ditemukan. Silakan cek kembali link verifikasi Anda.");
            return;
        }

        const success = await verifyEmail(token, password);
        if (success) {
            toast.success("Email berhasil diverifikasi! Silahkan login.");
            setPassword("");
            setTimeout(() => {
                router.push("/login");
            });
        } else {
            toast.error("Verifikasi gagal.")
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
            >
                <div className="flex justify-center mb-4">
                    <Lock className="w-12 h-12 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
                    Verifikasi Email
                </h2>
                <p className="text-center text-gray-600 mb-6 dark:text-gray-200">
                    Silakan atur password baru untuk akun Anda.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <PasswordInput
                            label="Password Baru"
                            value={password}
                            onChange={setPassword}
                            placeholder="Minimal 8 karakter"
                        />

                        <PasswordInput
                            label="Konfirmasi Password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Ulangi password baru"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {loading ? "Memverifikasi..." : "Setel Password"}
                    </button>
                </form>
            </motion.div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
