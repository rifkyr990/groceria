import { IUserAddressProps } from "./user_address";

export interface IUserProps {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  password: string;
  city?: string;
  province?: string;
  postalCode?: string;
  addresses?: IUserAddressProps[];
  role?: "CUSTOMER" | "STORE_ADMIN" | "SUPER_ADMIN";
  is_verified?: boolean;
  store?: string;
  storename?: string;
  storestatus?: boolean;
  profilePic?: string | File | null;
  socialLogin?: string;
  referralCode?: string;
  isVerified?: boolean;
  image_url: string;
  bio: string;
  date_of_birth: Date;
  store_id: number;
}
