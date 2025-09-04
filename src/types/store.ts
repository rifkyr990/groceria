import { IUserProps } from "./user";

export interface IStoreProps {
  id: number;
  storeName: string;
  storeAddress: string;
  storeCity: string;
  storeProvince: string;
  storeStatus: boolean;
  storeBanner?: string;
  storeAdmin?: IUserProps[];
  storeLat?: number;
  storeLong?: number;
}
