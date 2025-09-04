import AvatarUploader from "@/app/helper/AvatarUploader";
import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/app/helper/updateUserSchema";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IUserDetailsDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
  users: IUserProps;
}

// dummy stores data
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

export default function UserDetailsDialog({
  open,
  setOpen,
  users,
}: IUserDetailsDialog) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: users.first_name,
      last_name: users.last_name,
      email: users.email,
      phone: users.phone,
      city: users.city,
      province: users.province,
      role: users.role,
      address: users.address,
      storeName: users.storename,
      profilePic: undefined,
    },
  });

  const [initialData, setInitialData] = useState<IUserProps>(users);
  const [userRole, setUserRole] = useState<
    "customer" | "storeadmin" | "superadmin"
  >(users.role || "customer");
  const [edit, setEdit] = useState(false);

  const handleCancelEdit = () => {
    setEdit(false);

    reset({
      first_name: users.first_name,
      last_name: users.last_name ?? "",
      email: users.email,
      phone: users.phone,
      city: users.city,
      province: users.province,
      role: users.role,
      postalCode: users.postalCode ?? "",
      address: users.address,
      storeName: users.storename,
      profilePic: undefined,
    });
  };

  const onUpdate = async (data: UpdateUserSchema) => {
    try {
      console.log("Update Data", data);
      await new Promise((res) => setTimeout(res, 1000));

      alert("Data berhasil diupdate");

      setEdit(false);
      setInitialData((prev) => ({ ...prev, role: userRole, ...data }));
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {/* Avatar */}
        {edit ? (
          <div className="relative flex justify-center items-center h-full cursor-pointer">
            <AvatarUploader
              defaultImage={users.profilePic ?? undefined}
              register={register("profilePic")}
              className="brightness-50"
            />
            <Edit className="absolute top-10 text-white cursor-pointer" />
          </div>
        ) : (
          <AvatarUploader
            defaultImage={users.profilePic ?? undefined}
            register={register("profilePic")}
            disabled
          />
        )}

        {/* Content */}
        <form onSubmit={handleSubmit(onUpdate)}>
          <div className="flex max-sm:flex-col gap-x-2 w-full">
            <div id="first_name" className="w-full">
              <label className="max-md:text-sm">First Name</label>
              <Input
                {...register("first_name")}
                disabled={edit ? false : true}
                className="max-md:text-sm"
              />
              {errors.first_name?.message}
            </div>
            <div id="last_name" className="w-full">
              <label className="max-md:text-sm">Last Name</label>
              <Input
                {...register("last_name")}
                disabled={edit ? false : true}
                className="max-md:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-x-1 max-sm:flex-col">
            <div id="email" className="w-full">
              <label className="max-md:text-sm">Email</label>
              <Input
                type="email"
                {...register("email")}
                disabled={edit ? false : true}
                className="max-md:text-sm"
              />
            </div>
            <div id="phone" className="w-full">
              <label className="max-md:text-sm">Phone Number</label>
              <Input {...register("phone")} disabled={edit ? false : true} />
            </div>
          </div>
          <div className="flex gap-x-1">
            <div id="address" className="w-full">
              <label className="max-md:text-sm">Main Address</label>
              <Input
                {...register("address")}
                disabled={edit ? false : true}
                className="max-md:text-sm"
              />
            </div>
            <div id="user-role" className="w-full">
              <label className="max-md:text-sm">Role</label>
              <Select
                value={userRole}
                onValueChange={(
                  value: "customer" | "storeadmin" | "superadmin"
                ) => {
                  setUserRole(value);
                  setValue("role", value);
                }}
                disabled={edit ? false : true}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role">
                    {userRole}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectItem value="customer" className="text-xs">
                      Customer
                    </SelectItem>
                    <SelectItem value="storeadmin" className="text-xs ">
                      Store Admin
                    </SelectItem>
                    <SelectItem value="superadmin" className="text-xs ">
                      Super Admin
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-x-1">
            <div id="status" className="w-full">
              <label className="max-md:text-sm"> Status</label>
              <Input
                disabled
                defaultValue={
                  users.verifystatus ? "✅ Verified" : "⚠️Unverified"
                }
                className="max-md:text-sm"
              />
            </div>
            <div id="referral-code" className="w-full">
              <label className="max-md:text-sm">Referral Code</label>
              <Input
                disabled
                defaultValue={users.referralCode}
                className="max-md:text-sm"
              />
            </div>
          </div>
          {userRole.toLowerCase() !== "customer" && (
            <div id="store-name">
              <label>Store Name</label>
              <Select disabled={edit ? false : true}>
                <SelectTrigger>
                  <SelectValue placeholder="store-name"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Stores</SelectLabel>
                    {stores.map((store) => (
                      <div key={store.id}>
                        <SelectItem value={store.storeName}>
                          {store.storeName}
                        </SelectItem>
                      </div>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </form>
        {/* Footer */}
        <DialogFooter>
          {edit ? (
            <>
              {users.verifystatus === false && (
                <Button>
                  <Mail /> Send Verification
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving Data" : "Save Data"}
              </Button>

              <Button onClick={handleCancelEdit} variant={"destructive"}>
                Cancel Edit
              </Button>
            </>
          ) : (
            <Button onClick={() => setEdit((prev) => !prev)}>Edit Data</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
