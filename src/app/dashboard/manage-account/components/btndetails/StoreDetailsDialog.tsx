import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IStoreProps } from "@/types/store";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

const MapPicker = dynamic(() => import("@/components/MapPickerInner"), {
  ssr: false,
});

const stores: IStoreProps[] = [
  {
    id: 1,
    storeName: "Fulano Store",
    storeAddress: "Jl Gedang Raja 2",
    storeCity: "Surabaya",
    storeProvince: "Jawa Timur",
    storeStatus: true,
    storeAdmin: [
      {
        id: 1,
        first_name: "Hendro",
        last_name: "Monawaroh",
        phone: "08555",
        email: "hendro@mail.com",
      },
      {
        id: 2,
        first_name: "Fulan",
        last_name: "Muamar",
        phone: "08123123",
        email: "random@mail.com",
      },
      {
        id: 3,
        first_name: "Mulan",
        last_name: "Sabrina",
        phone: "08123123",
        email: "random@mail.com",
      },
    ],
    storeBanner: "https://picsum.photos/seed/picsum/500/300",
  },
  {
    id: 2,
    storeName: "Fulani Store",
    storeAddress: "Jl Tentara Istimewa 1",
    storeCity: "Jakarta",
    storeProvince: "Jawa Timur",
    storeStatus: false,
    storeAdmin: [
      {
        id: 1,
        first_name: "Hendro",
        last_name: "Monawaroh",
        phone: "08555",
        email: "hendro@mail.com",
      },
      {
        id: 2,
        first_name: "Fulan",
        last_name: "Muamar",
        phone: "08123123",
        email: "random@mail.com",
      },
      {
        id: 3,
        first_name: "Mulan",
        last_name: "Sabrina",
        phone: "08123123",
        email: "random@mail.com",
      },
    ],
    storeBanner: "https://picsum.photos/seed/picsum/500/300",
  },
  {
    id: 3,
    storeName: "Aldino Store",
    storeAddress: "Jl Jakarta Istimewa 1",
    storeCity: "Jakarta",
    storeProvince: "DKI Jakarta",
    storeStatus: true,
    storeAdmin: [
      {
        id: 1,
        first_name: "Eko",
        last_name: "Monawaroh",
        phone: "08555",
        email: "random@mail.com",
      },
      {
        id: 2,
        first_name: "Rustam",
        last_name: "Muamar",
        phone: "08123123",
        email: "random@mail.com",
      },
      {
        id: 3,
        first_name: "Mulan",
        last_name: "Sabrina",
        phone: "08123123",
        email: "random@mail.com",
      },
    ],
  },
  {
    id: 4,
    storeName: "Alden Store",
    storeAddress: "Jl Jakarta Istimewa 1",
    storeCity: "Bogor",
    storeProvince: "Jawa Barat",
    storeStatus: true,
    storeAdmin: [
      {
        id: 1,
        first_name: "Hendro",
        last_name: "Monawaroh",
        phone: "08555",
        email: "random@mail.com",
      },
    ],
  },
];

interface IStoreDetailsDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
  store: IStoreProps;
}

export default function StoreDetailsDialog({
  open,
  setOpen,
  store,
}: IStoreDetailsDialog) {
  const { register, setValue, watch } = useForm({
    defaultValues: {
      storeName: store.storeName,
      address: store.storeAddress,
      city: store.storeCity,
      province: store.storeProvince,
    },
  });
  const address = watch("address");

  const [storeStatus, setStoreStatus] = useState<string>(
    store.storeStatus ? "active" : "inactive"
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Store Details</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </DialogDescription>
          </DialogHeader>
          <form>
            {/* Store Banner */}
            <div className="flex justify-center ">
              <Image
                src={store.storeBanner ?? "/assets/defaultbanner2.svg"}
                alt="store-banner"
                width={300}
                height={100}
                className="rounded-md"
              />
            </div>
            {/* Store Profile */}
            <div id="store-name">
              <label className="text-sm">Name</label>
              <Input {...register("storeName")} className="max-sm:text-xs" />
            </div>
            <div id="store-address">
              <label className="text-sm">Address</label>
              <Input {...register("address")} className="max-sm:text-xs" />
            </div>
            <div id="store-city-province" className="flex gap-x-2">
              <div id="city" className="w-full">
                <label className="text-sm">City/County</label>
                <Input {...register("city")} className="max-sm:text-xs" />
              </div>
              <div id="province" className="w-full">
                <label className="text-sm">Province</label>
                <Input {...register("province")} className="max-sm:text-xs" />
              </div>
            </div>

            <div className="flex gap-x-2">
              <div id="status" className=" ">
                <label className="text-sm">Store Status</label>
                <Select value={storeStatus} onValueChange={setStoreStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active" className="text-xs">
                        Active
                      </SelectItem>
                      <SelectItem value="inactive" className="text-xs ">
                        Inactive
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div
                id="map-picker"
                className="w-full max-w-md h-40 mx-auto my-4"
              >
                <MapPicker
                  onLocationSelect={(data) => {
                    setValue("address", data.road);
                    setValue("city", data.city);
                    setValue("province", data.province);
                  }}
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button>Edit Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
