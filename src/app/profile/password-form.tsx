"use client";

import { useUserStore } from "@/store/user-store";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface PasswordFormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function PasswordForm() {
    const { changePassword } = useUserStore();
    const { register, handleSubmit, reset } = useForm<PasswordFormValues>();
    const {logout} = useAuthStore();
    const router = useRouter();

    const onSubmit = async (data: PasswordFormValues) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Password baru dan konfirmasi tidak cocok.");
            return;
        }

        const success = await changePassword(data.oldPassword, data.newPassword);
        if (success) {
            reset();
            logout();
            router.push("/login");
        }
    }
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Password Lama</label>
                    <input type="password" {...register("oldPassword", { required: true })} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password Baru</label>
                    <input type="password" {...register("newPassword", { required: true })} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Konfirmasi Password</label>
                    <input type="password" {...register("confirmPassword", { required:true })} className="w-full border rounded p-2" />
                </div>
                <div className="flex justify-end gap-4 mt-10">
                    <button className="w-45 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                        <a href="/">Kembali</a>
                    </button>
                    <button
                        type="submit"
                        className="w-45 bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
}
