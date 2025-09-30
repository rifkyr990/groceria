"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string;
  email: string;
}

export default function ProfilePage() {
  const { updateProfile, updateProfilePicture, resendVerificationEmail } = useUserStore();
  const { user, hydrate } = useAuthStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<ProfileFormValues>();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

  useEffect(() => {
    if (user) {
        setValue("first_name", user.first_name);
        setValue("last_name", user.last_name);
        setValue("phone", user.phone || "");
        setValue("email", user.email);
        setValue("bio", user.profile?.bio || "");
        setValue(
            "date_of_birth",
            user.profile?.date_of_birth
            ? new Date(user.profile.date_of_birth).toISOString().split("T")[0]
            : ""
        );
        if (user.image_url) setPreview(user.image_url);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });

    const success = await updateProfile(formData);
    if (success) {
      toast.success("Profil berhasil diperbarui!");
    } else {
      toast.error("Gagal update profil");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Format gambar harus .jpg, .jpeg, .png, atau .gif");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error("Ukuran maksimum gambar adalah 1MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    const success = await updateProfilePicture(file);
    if (!success) toast.error("Gagal update foto profil");
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast.error("Email user tidak ditemukan");
      return;
    }

    try {
      setResendLoading(true);
      await resendVerificationEmail(); // store akan menampilkan toast sukses/gagal juga
    } catch (err: any) {
      toast.error(err?.message || "Gagal mengirim ulang email verifikasi");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow"
      >
        {/* Upload foto */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative rounded-full overflow-hidden border">
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleImageChange}
            />
            <span className="text-xs text-gray-500">
              Format: JPG, PNG, GIF | Maks: 1MB
            </span>
          </div>
        </div>

        {/* Nama */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Nama Depan</label>
            <input
              type="text"
              {...register("first_name")}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Nama Belakang</label>
            <input
              type="text"
              {...register("last_name")}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded p-2"
          />
          {!user?.is_verified && (
            <div className="mt-2 flex items-center gap-3">
              <p className="text-red-500 text-sm">
                Email belum diverifikasi. Silakan cek inbox/spam untuk link verifikasi.
              </p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className={`text-sm underline text-green-600 disabled:opacity-50 ${
                    resendLoading ? "cursor-wait" : ""
                }`}
              >
                {resendLoading ? "Mengirim..." : "Kirim Ulang Verifikasi Email Baru"}
              </button>
            </div>
          )}
        </div>

        {/* Telepon */}
        <div>
            <label className="block text-sm mb-1">No. Telepon</label>
            <input
                type="text"
                {...register("phone")}
                className="w-full border rounded p-2"
            />
        </div>

        <div className="flex justify-end gap-4 mt-10">
            <button
                className="w-45 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                type="button"
                onClick={() => (window.location.href = "/")}
            >
                Kembali
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