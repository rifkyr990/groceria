"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// import MapPickerInner secara dinamis
const MapPicker = dynamic(() => import("@/components/MapPickerInner"), {
  ssr: false,
});

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
  latitude: number;
  longitude: number;
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
        latitude: -6.2,
        longitude: 106.816666,
      },
    });

  const [open, setOpen] = useState(false);

  const { provinces, cities, districts, subdistricts } = useWilayah({
    provinceId: watch("province"),
    cityId: watch("city"),
    districtId: watch("district"),
  });

  const selectedSub = subdistricts.find(
    (s) => s.subdistrict_id === watch("subdistrict")
  );
  useEffect(() => {
    if (selectedSub?.zip_code) {
      setValue("postal_code", selectedSub.zip_code);
    } else {
      setValue("postal_code", "");
    }
  }, [selectedSub, setValue]);

  useEffect(() => {
    const provinceName = provinces.find(
      (p) => p.province_id === watch("province")
    )?.province;
    const cityName = cities.find((c) => c.city_id === watch("city"))?.city_name;
    const districtName = districts.find(
      (d) => d.district_id === watch("district")
    )?.district_name;
    const subdistrictName = subdistricts.find(
      (s) => s.subdistrict_id === watch("subdistrict")
    )?.subdistrict_name;

    const fullAddress = [
      subdistrictName,
      districtName,
      cityName,
      provinceName,
      "Indonesia",
    ]
      .filter(Boolean)
      .join(", ");

    if (fullAddress) {
      const fetchCoords = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
          );
          const data = await res.json();
          if (data && data.length > 0) {
            setValue("latitude", parseFloat(data[0].lat));
            setValue("longitude", parseFloat(data[0].lon));
          }
        } catch (err) {
          console.error("Gagal fetch koordinat:", err);
        }
      };
      fetchCoords();
    }
  }, [
    watch("province"),
    watch("city"),
    watch("district"),
    watch("subdistrict"),
  ]);

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
      province_id: data.province,
      city_id: data.city,
      district_id: data.district,
      subdistrict_id: data.subdistrict,
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
                {renderOptions(
                  provinces,
                  "province_id",
                  "province",
                  "Pilih Provinsi"
                )}
              </select>
            </div>

            <div>
              <Label className="mb-3">Kota/Kabupaten</Label>
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
              <Label className="mb-3">Kecamatan</Label>
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
              <Label className="mb-3">Kelurahan/Desa</Label>
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
            <Label className="mb-3">Kode Pos</Label>
            <Input {...register("postal_code")} readOnly />
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
          <div className="w-full max-w-md h-40 mx-auto my-4">
            <MapPicker
              disabled={false}
              defaultLocation={{
                lat: watch("latitude"),
                long: watch("longitude"),
                road: watch("street"),
                city: watch("city"),
                province: watch("province"),
              }}
              onLocationSelect={(data) => {
                setValue("latitude", data.lat);
                setValue("longitude", data.long);
              }}
            />
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
