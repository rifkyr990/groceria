"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MailCheck, RefreshCcw } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function CheckEmailPage() {
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");

    const resendVerification = async () => {
        setResending(true);
        setMessage("");
        try {
        // contoh endpoint kirim ulang verifikasi
            const res = await axios.post("http://localhost:5000/api/auth/resend-verification");
            setMessage(res.data.message || "Email verifikasi sudah dikirim ulang");
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Gagal mengirim ulang email");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center"
            >
                <div className="flex justify-center mb-6">
                    <MailCheck className="w-14 h-14 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Silahkan cek email anda
                </h2>
                <p className="text-gray-500 mb-6">
                    Kami sudah mengirim link verifikasi ke email Anda.  
                    Klik link tersebut untuk mengaktifkan akun.
                </p>

                <button
                    onClick={resendVerification}
                    disabled={resending}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-green-600 text-green-600 px-4 py-2 font-semibold shadow-sm hover:bg-green-50 disabled:opacity-50"
                >
                    <RefreshCcw className="w-4 h-4" />
                    {resending ? "Mengirim ulang..." : "Kirim ulang verifikasi email"}
                </button>

                {message && <p className="text-sm text-green-600 mt-3">{message}</p>}

                <div className="mt-6">
                    <Link href="/" className="text-sm text-gray-500 hover:underline">
                        ← Kembali berbelanja
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
