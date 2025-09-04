import { IUserProps } from "@/types/user";
import DashboardLayout from "../components/DashboardLayout";
import UsersTableCard from "./components/UsersTable";
import StoreData from "./components/StoreData";

const users: IUserProps[] = [
  {
    id: 1,
    first_name: "Aldino ",
    last_name: "Fulano Putra",
    phone: "081123123",
    city: "Surakarta",
    province: "Jawa Tengah",
    postalCode: "123123",
    address: "Jl TB Simatupang 1",
    email: "aldino@mail.com",
    role: "customer",
    verifystatus: true,
    storename: "Si Aldi Store",
    storestatus: true,
    referralCode: "ABG123",
    profilePic: "/assets/rdusericon.jpg",
  },
  {
    id: 2,
    first_name: "Fulan",
    last_name: "Andreas",
    phone: "08145645645",
    email: "fulan@mail.com",
    role: "storeadmin",
    verifystatus: false,
    storename: "Si Fulan Store",
    storestatus: true,
    referralCode: "ABG123",
  },
  {
    id: 3,
    first_name: "Fulana",
    last_name: "Antoni",
    phone: "0834534534",
    email: "fulana@mail.com",
    role: "storeadmin",
    verifystatus: true,
    storename: "Si Fulana Store",
    storestatus: true,
    referralCode: "ABG123",
  },
  {
    id: 4,
    first_name: "Fulani",
    last_name: "Toto",
    phone: "0834534534",
    email: "fulana@mail.com",
    role: "storeadmin",
    verifystatus: true,
    storename: "Si Fulani Store",
    storestatus: true,
    referralCode: "ABG123",
  },
];

export default function AccountPage() {
  return (
    <DashboardLayout>
      <div className="grid-cols-1  grid gap-4 ">
        {/* <LatestRegisteredCard className="order-1" /> */}
        {/* <StoreAdminDirectoryCard className="order-4" /> */}
        <StoreData className="order-3" />
        <UsersTableCard users={users} className="order-2" />
      </div>
    </DashboardLayout>
  );
}
