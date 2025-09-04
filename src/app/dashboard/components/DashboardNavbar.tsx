"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  Menu,
  MessageCircleMore,
  MessagesSquare,
  Search,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DropDownProfile from "./DropDownProfile";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardNavbar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center h-10 p-10 max-sm:px-4 bg-white ">
      <div className="flex items-center">
        {/* Logo */}
        <Image
          src="/assets/logo-long.svg"
          alt="company-logo"
          width={100}
          height={100}
          className="w-30  md:w-50 md:h-50 "
        ></Image>
      </div>
      <div className=" flex items-center xl:w-1/2">
        <p className="text-2xl font-bold max-xl:hidden w-full">
          Administrator Dashboard
        </p>
        <div className="w-full relative">
          <Input
            className="w-full bg-white max-xl:hidden"
            placeholder="Search . . ."
          />
          <Search className="absolute top-2 right-3 size-5 max-xl:hidden text-gray-500 cursor-pointer" />
        </div>
      </div>

      <div className="flex items-center gap-x-5">
        <Bell className="bg-gradient-to-b from-emerald-500 to-teal-600 text-white size-8 md:size-10   rounded-xl p-2 max-md:hidden " />
        <Sun className="bg-gradient-to-b from-emerald-500 to-teal-600 text-white size-8 md:size-10   rounded-xl p-2 max-md:hidden " />

        <div className="flex items-center justify-between gap-x-3 ">
          <div className="w-1 h-8 bg-blue-500 max-md:hidden"></div>
          <div className="flex items-center lg:gap-x-2 max-lg:bg-gray-200 max-lg:p-1 max-lg:rounded-full ">
            <div className="flex flex-col ">
              <p className="font-semibold max-lg:hidden">John Doe</p>
              <p className="max-lg:hidden">Super Admin</p>
            </div>
            <DropdownMenu onOpenChange={setIsDropDownOpen}>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="flex items-center">
                  <Avatar className="size-11 max-sm:size-8 ">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>ID</AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`${isDropDownOpen && "rotate-180"} transform duration-300 mx-2 cursor-pointer`}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropDownProfile />
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
