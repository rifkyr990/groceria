"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Password tidak sama, silakan cek kembali.");
            toast.error("Password tidak sama, silahkan cek kembali.")
            return;
        }

        if (!token) {
            setError("Token tidak ditemukan, silakan cek link reset password Anda.");
            toast.error("Token tidak ditemukan, silakan cek link reset password Anda.")
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
                token,
                new_password: newPassword,
            });

            setMessage(res.data.message || "Password berhasil direset, silakan login.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800"
            >
                <div className="flex justify-center mb-6">
                    <Lock className="w-14 h-14 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
                    Reset Kata Sandi
                </h2>
                <p className="text-center text-gray-500 mb-6 dark:text-gray-300">
                    Masukkan kata sandi baru Anda untuk melanjutkan.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1 dark:text-gray-300">Password Baru</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Masukkan password baru"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-1 dark:text-gray-300">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Mengatur ulang..." : "Reset Password"}
                    </button>
                </form>

                {message && <p className="text-green-600 text-sm mt-4 text-center dark:text-gray-300">{message}</p>}
                {error && <p className="text-red-500 text-sm mt-4 text-center dark:text-gray-300">{error}</p>}

                <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-300">
                    Kembali ke{" "}
                    <Link href="/login" className="text-green-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
