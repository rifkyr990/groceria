import { IUserProps } from "./user";

export interface IStoreProps {
  id: number;
  name: string;
  address: string;
  province?: string;
  city?: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  is_main_store: boolean;
  storeBanner?: string;
  admins?: IUserProps[];
  storeLat?: number;
  storeLong?: number;
}

export interface IAdminStoreData {
  role: string;
  store_id: number;
}
