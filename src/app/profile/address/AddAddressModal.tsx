"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddressStore } from "@/store/address-store";
import useWilayah, { Wilayah } from "@/hooks/use-wilayah";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressFormValues {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postal_code: string;
    street: string;
    detail: string;
    label: "RUMAH" | "KANTOR";
    is_primary: boolean;
}

export default function AddAddressModal() {
    const { addAddress } = useAddressStore();
    const { register, handleSubmit, watch, reset } = useForm<AddressFormValues>({
        defaultValues: {
            name: "",
            phone: "",
            province: "",
            city: "",
            district: "",
            postal_code: "",
            street: "",
            detail: "",
            label: "RUMAH",
            is_primary: false,
        },
    });

    const [open, setOpen] = useState(false);
    const { provinces, cities, districts, postalCodes } = useWilayah({
        provinceId: watch("province"),
        cityId: watch("city"),
        districtId: watch("district"),
    });

    // AddAddressModal.tsx (onSubmit)
    const onSubmit = async (data: AddressFormValues) => {
    // ambil nama berdasarkan ID dari hook useWilayah
    const provinceName = provinces.find(p => p.id === data.province)?.name || "";
    const cityName = cities.find(c => c.id === data.city)?.name || "";
    const districtName = districts.find(d => d.id === data.district)?.name || "";

    const payload = {
        ...data,
        province: provinceName,
        city: cityName,
        district: districtName,
    };

    const success = await addAddress(payload);
    if (success) {
        toast.success("Alamat berhasil ditambahkan!");
        setOpen(false);
        reset();
    }
    };


    const renderOptions = (items: (Wilayah | string)[], placeholder: string) => (
        <>
            <option value="">{placeholder}</option>
            {items.map((item) =>
                typeof item === "string" ? (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ) : (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                )
            )}
        </>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="bg-green-600 text-white">
                + Tambah Alamat
            </Button>
        </DialogTrigger>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
                Tambah Alamat Baru
            </DialogTitle>
        </DialogHeader>

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
        >
            <div>
                <Label className="mb-3">Nama</Label>
                <Input {...register("name")} placeholder="Nama penerima" />
            </div>

            <div>
                <Label className="mb-3">Nomor Telepon</Label>
                <Input {...register("phone")} placeholder="08xxxx" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="mb-3">Provinsi</Label>
                    <select {...register("province")} className="input w-full">
                        {renderOptions(provinces, "Pilih Provinsi")}
                    </select>
                </div>

                <div>
                    <Label className="mb-3">Kota/Kabupaten</Label>
                    <select
                        {...register("city")}
                        className="input w-full"
                        disabled={!watch("province")}
                    >
                        {renderOptions(cities, "Pilih Kota")}
                    </select>
                </div>
            </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
                <Label className="mb-3">Kecamatan</Label>
                <select
                    {...register("district")}
                    className="input w-full"
                    disabled={!watch("city")}
                >
                    {renderOptions(districts, "Pilih Kecamatan")}
                </select>
            </div>

            <div>
              <Label className="mb-3">Kode Pos</Label>
              <select
                {...register("postal_code")}
                className="input w-full"
                disabled={!watch("district")}
              >
                {renderOptions(postalCodes, "Pilih Kode Pos")}
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-3">Nama Jalan</Label>
            <Input {...register("street")} placeholder="Jl. Contoh No. 123" />
          </div>

          <div>
            <Label className="mb-3">Detail Alamat</Label>
            <textarea
              {...register("detail")}
              placeholder="Blok, RT/RW, patokan, dll"
              className="w-full border rounded p-2"
            ></textarea>
          </div>

          <div>
            <Label className="mb-3">Label Alamat</Label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" value="RUMAH" {...register("label")} />
                Rumah
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="KANTOR" {...register("label")} />
                Kantor
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_primary")} />
            <span>Jadikan alamat utama</span>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-500 text-white"
            >
              Batal
            </Button>
            <Button type="submit" className="bg-green-600 text-white">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
