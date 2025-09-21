"use client";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";
import CustomerTable from "./components/CustomerTable";
import StoreAdminData from "./components/StoreAdminTable";
interface IStoreAdminData {
  storeAdmins: {
    withStore: IStoreProps[];
    withoutStore: IUserProps[];
  };
}
export default function AccountPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [customers, setCustomers] = useState<IUserProps[]>([]);
  const [storeAdmins, setStoreAdmins] = useState<{
    withStore: IStoreProps[];
    withoutStore: IUserProps[];
  }>({
    withStore: [],
    withoutStore: [],
  });
  const [stores, setStores] = useState<IStoreProps[]>([]);

  const getUsersData = async () => {
    try {
      const res = await apiCall.get("/api/user/all");
      const data = res.data.data;
      setUsers(data);
    } catch (error) {
      console.log(error);
      alert("eror");
    }
  };

  const getCustomersData = async () => {
    try {
      const res = await apiCall.get("/api/user/customers");
      const data = res.data.data;
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStoreAdmins = async () => {
    try {
      const res = await apiCall.get("/api/store/store-admins");
      const data = res.data.data;
      setStoreAdmins(data);
    } catch (error) {
      console.log(error);
      alert("eror");
    }
  };

  const getStoresData = async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const data = res.data.data;
      setStores(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
      alert("Eror");
    }
  };

  useEffect(() => {
    getUsersData();
    getStoresData();
    getCustomersData();
    getStoreAdmins();
  }, []);
  // cek role, kalau tidak bisa berikan alert
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (!jsonData) return;
    if (jsonData.role === "STORE_ADMIN") {
      toast.error("You are not allowed to access this page");
      router.replace("/dashboard/manage-order");
      return;
    }
  }, [router]);
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col 2xl:flex-row 2xl:justify-between gap-3">
          <CustomerTable
            customers={customers}
            stores={stores}
            className="w-full"
          />
          <StoreAdminData storeAdmins={storeAdmins} className="w-full" />
        </div>
        {/* <StoreData className=" mb-8" stores={stores} /> */}
      </div>
    </DashboardLayout>
  );
}
