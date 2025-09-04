"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Token tidak ditemukan. Silakan cek kembali link verifikasi Anda.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setMessage(null);

            await axios.post("http://localhost:5000/api/auth/verify-email", {
                token,
                password,
            });

            setMessage("Email berhasil diverifikasi! Silakan login.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Verifikasi gagal.");
        } finally {
            setLoading(false);
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password Baru
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Minimal 8 karakter"
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

            {message && (
            <p className="mt-4 text-center text-green-600 font-medium dark:text-gray-300">
                {message}
            </p>
            )}
            {error && (
            <p className="mt-4 text-center text-red-600 font-medium dark:text-gray-300">
                {error}
            </p>
            )}
        </motion.div>
        </div>
    );
}
