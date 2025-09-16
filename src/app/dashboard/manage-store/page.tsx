"use client";
import { IUserProps } from "@/types/user";
import DashboardLayout from "../components/DashboardLayout";
import StoreData from "./components/StoreData";
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import StoreAdminData from "./components/StoreAdminTable";
import CustomerTable from "./components/CustomerTable";

export default function AccountPage() {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [storeAdmins, setStoreAdmins] = useState<IStoreProps[]>([]);
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

    } catch (error) {
      console.log(error);
      alert("Eror");
    }
  };

  useEffect(() => {
    getUsersData();
    getStoresData();
    getStoreAdmins();
  }, []);
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 ">
        <StoreData className=" mb-8" stores={stores} />
        <StoreAdminData storeAdmins={storeAdmins} className="w-full" />
      </div>
    </DashboardLayout>
  );
}
