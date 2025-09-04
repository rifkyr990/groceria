export interface IUserProps {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  address?: string;
  role?: "customer" | "storeadmin" | "superadmin";
  verifystatus?: boolean;
  storename?: string;
  storestatus?: boolean;
  profilePic?: string | File | null;
  socialLogin?: string;
  referralCode?: string;
}
