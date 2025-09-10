"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    district?: string;
    postal_code: string;
    street: string;
    detail: string;
    label: "RUMAH" | "KANTOR";
    is_primary: boolean;
}

interface EditAddressModalProps {
  address: any; // bisa diketik lebih detail sesuai type address-store
}

export default function EditAddressModal({ address }: EditAddressModalProps) {
  const { updateAddress } = useAddressStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, reset, setValue } =
    useForm<AddressFormValues>({
      defaultValues: {
        name: address.name,
        phone: address.phone,
        province: address.province_id || "",
        city: address.city_id || "",
        district: address.district_id || "",
        postal_code: address.postal_code,
        street: address.street,
        detail: address.detail,
        label: address.label,
        is_primary: address.is_primary,
      },
    });

  const { provinces, cities, subdistricts } = useWilayah({
    provinceId: watch("province"),
    cityId: watch("city"),
  });

  // auto isi postal_code berdasarkan city
  const selectedCity = cities.find((c) => c.city_id === watch("city"));
  useEffect(() => {
    if (selectedCity?.postal_code) {
      setValue("postal_code", selectedCity.postal_code);
    }
  }, [selectedCity, setValue]);

  const onSubmit = async (data: AddressFormValues) => {
    const provinceName =
      provinces.find((p) => p.province_id === data.province)?.province || "";
    const cityName =
      cities.find((c) => c.city_id === data.city)?.city_name || "";
    const districtName =
      subdistricts.find((d) => d.subdistrict_id === data.district)
        ?.subdistrict_name || "";

    const payload = {
        ...data,
        province: provinceName,
        city: cityName,
        district: districtName,
    };

    const success = await updateAddress(address.id, payload);
    if (success) {
        toast.success("Alamat berhasil diperbarui!");
        setOpen(false);
        reset();
    }
  };

  const renderOptions = (
    items: Wilayah[],
    valueKey: keyof Wilayah,
    labelKey: keyof Wilayah,
    placeholder: string
  ) => (
    <>
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={String(item[valueKey])} value={String(item[valueKey])}>
          {String(item[labelKey])}
        </option>
      ))}
    </>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="hover:underline">
        Ubah
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Ubah Alamat
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <Label>Nama</Label>
              <Input {...register("name")} />
            </div>

            <div>
              <Label>Nomor Telepon</Label>
              <Input {...register("phone")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Provinsi</Label>
                <select {...register("province")} className="input w-full">
                  {renderOptions(
                    provinces,
                    "province_id",
                    "province",
                    "Pilih Provinsi"
                  )}
                </select>
              </div>
              <div>
                <Label>Kota/Kabupaten</Label>
                <select
                  {...register("city")}
                  className="input w-full"
                  disabled={!watch("province")}
                >
                  {renderOptions(cities, "city_id", "city_name", "Pilih Kota")}
                </select>
              </div>
            </div>

            {subdistricts.length > 0 && (
              <div>
                <Label>Kecamatan</Label>
                <select {...register("district")}
                  className="input w-full"
                  disabled={!watch("city")}
                >
                  {renderOptions(
                    subdistricts,
                    "subdistrict_id",
                    "subdistrict_name",
                    "Pilih Kecamatan"
                  )}
                </select>
              </div>
            )}

            <div>
              <Label>Kode Pos</Label>
              <Input {...register("postal_code")} readOnly />
            </div>

            <div>
              <Label>Nama Jalan</Label>
              <Input {...register("street")} />
            </div>

            <div>
              <Label>Detail Alamat</Label>
              <textarea
                {...register("detail")}
                className="w-full border rounded p-2"
              ></textarea>
            </div>

            <div>
              <Label>Label Alamat</Label>
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
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
