"use client";

import { useState, useEffect } from "react";
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
  subdistrict: string;
  postal_code: string;
  street: string;
  detail: string;
  label: "RUMAH" | "KANTOR";
  is_primary: boolean;
}

export default function AddAddressModal() {
  const { addAddress } = useAddressStore();
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<AddressFormValues>({
      defaultValues: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        subdistrict: "",
        postal_code: "",
        street: "",
        detail: "",
        label: "RUMAH",
        is_primary: false,
      },
    });

  const [open, setOpen] = useState(false);

  const { provinces, cities, districts, subdistricts } = useWilayah({
    provinceId: watch("province"),
    cityId: watch("city"),
    districtId: watch("district"),
  });

  const selectedSub = subdistricts.find((s) => s.subdistrict_id === watch("subdistrict"));
  useEffect(() => {
    if (selectedSub?.zip_code) {
      setValue("postal_code", selectedSub.zip_code);
    } else {
      setValue("postal_code", "");
    }
  }, [selectedSub, setValue]);

  const onSubmit = async (data: AddressFormValues) => {
    const provinceName =
      provinces.find((p) => p.province_id === data.province)?.province || "";
    const cityName =
      cities.find((c) => c.city_id === data.city)?.city_name || "";
    const districtName =
      districts.find((d) => d.district_id === data.district)?.district_name ||
      "";
    const subdistrictName =
      subdistricts.find((s) => s.subdistrict_id === data.subdistrict)
        ?.subdistrict_name || "";

    const payload = {
      ...data,
      province: provinceName,
      city: cityName,
      district: districtName,
      subdistrict: subdistrictName,
    };

    const success = await addAddress(payload);
    if (success) {
      toast.success("Alamat berhasil ditambahkan!");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white">+ Tambah Alamat</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Tambah Alamat Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label>Nama</Label>
            <Input {...register("name")} placeholder="Nama penerima" />
          </div>

          <div>
            <Label>Nomor Telepon</Label>
            <Input {...register("phone")} placeholder="08xxxx" />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kecamatan</Label>
              <select
                {...register("district")}
                className="input w-full"
                disabled={!watch("city")}
              >
                {renderOptions(
                  districts,
                  "district_id",
                  "district_name",
                  "Pilih Kecamatan"
                )}
              </select>
            </div>
          {/* Kelurahan/Desa */}
            <div>
              <Label>Kelurahan/Desa</Label>
              <select
                {...register("subdistrict")}
                className="input w-full"
                disabled={!watch("district")}
              >
                {renderOptions(
                  subdistricts,
                  "subdistrict_id",
                  "subdistrict_name",
                  "Pilih Kelurahan/Desa"
                )}
              </select>
            </div>

          </div>
          {/* Kecamatan */}
          <div>
            <Label>Kode Pos</Label>
            <Input {...register("postal_code")} readOnly />
          </div>

          <div>
            <Label>Nama Jalan</Label>
            <Input {...register("street")} placeholder="Jl. Contoh No. 123" />
          </div>

          <div>
            <Label>Detail Alamat</Label>
            <textarea
              {...register("detail")}
              placeholder="Blok, RT/RW, patokan, dll"
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
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
