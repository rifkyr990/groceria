"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/request-reset", { email });
            setMessage(res.data.message || "Link reset password telah dikirim ke email Anda.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800"
            >
                <div className="flex justify-center mb-6">
                    <Image
                        src="/assets/logo-short.svg"
                        alt="Logo"
                        width={70}
                        height={70}
                        priority
                    />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
                    Lupa Kata Sandi?
                </h2>
                <p className="text-center text-gray-500 mb-6 dark:text-gray-300">
                    Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email Anda"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>

                {message && <p className="text-green-600 text-sm mt-4 text-center">{message}</p>}
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

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
