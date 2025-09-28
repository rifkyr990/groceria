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

import AddressSelect from "../component/AddressSelect";
import MapPickerWrapper from "../component/MapPickerWrapper";
import { mapToWilayahId, mapIdToName } from "@/utils/wilayahHelpers";

interface AddressFormValues { name: string; phone: string; province: string; city: string; district: string; subdistrict: string; postal_code: string; street: string; detail: string; label: "RUMAH" | "KANTOR"; is_primary: boolean; latitude: number; longitude: number;}

interface EditAddressModalProps {
  address: AddressFormValues & { id: number };
}

export default function EditAddressModal({ address }: EditAddressModalProps) {
  const { updateAddress } = useAddressStore();
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<AddressFormValues>({
      defaultValues: address,
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

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const { provinceId, cityId, districtId, subdistrictId } = mapToWilayahId(address,provinces,cities,districts,subdistricts);

      reset({
        ...address,
        province: provinceId,
        city: cityId,
        district: districtId,
        subdistrict: subdistrictId,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    }
  };

  const onSubmit = async (data: AddressFormValues) => {
    const { provinceName, cityName, districtName, subdistrictName } = mapIdToName( data,provinces,cities,districts,subdistricts);
    const payload = { ...data,province: provinceName, city: cityName, district: districtName, subdistrict: subdistrictName };
    const success = await updateAddress(Number(address.id), payload);

    if (success) {
      toast.success("Alamat berhasil diperbarui!");
      setOpen(false);
      reset(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white">Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Alamat</DialogTitle>
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
            <AddressSelect label="Provinsi" items={provinces} valueKey="province_id" labelKey="province" placeholder="Pilih Provinsi" value={watch("province")} onChange={(val) => setValue("province", val)}/>
            <AddressSelect label="Kota/Kabupaten" items={cities} valueKey="city_id" labelKey="city_name" placeholder="Pilih Kota" disabled={!watch("province")} value={watch("city")} onChange={(val) => setValue("city", val)}/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AddressSelect label="Kecamatan" items={districts} valueKey="district_id" labelKey="district_name" placeholder="Pilih Kecamatan" disabled={!watch("city")} value={watch("district")} onChange={(val) => setValue("district", val)}/>
            <AddressSelect label="Kelurahan/Desa" items={subdistricts} valueKey="subdistrict_id" labelKey="subdistrict_name" placeholder="Pilih Kelurahan/Desa" disabled={!watch("district")} value={watch("subdistrict")} onChange={(val) => setValue("subdistrict", val)}/>
          </div>

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

          <MapPickerWrapper lat={watch("latitude")} long={watch("longitude")} street={watch("street")} city={watch("city")} province={watch("province")} onLocationSelect={(data) => { setValue("latitude", data.lat); setValue("longitude", data.long);}}
          />

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
            <Button type="submit" className="bg-blue-600 text-white">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
