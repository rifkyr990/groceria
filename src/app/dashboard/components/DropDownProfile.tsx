"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";

export default function DropDownProfile() {
  return (
    <DropdownMenuContent className="p-1">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Settings />
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LogOut />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
