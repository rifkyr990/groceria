import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Archive,
  BadgePercent,
  ChartLine,
  ChevronRight,
  LogOut,
  Package,
  Store,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CustomSidebarTrigger from "@/app/dashboard/components/CustomSidebarTrigger";

interface IAppSidebar {
  className?: string;
}

const items = [
  {
    id: 1,
    icon: <Store className="size-10" />,
    menu: "Store ",
    url: "/dashboard/manage-store",
  },
  {
    id: 2,
    icon: <UserRoundPen className="size-10" />,
    menu: "Account ",
    url: "/dashboard/manage-account",
  },
  {
    id: 3,
    icon: <Package className="size-10" />,
    menu: "Product ",
    url: "/dashboard/manage-product",
  },
  {
    id: 4,
    icon: <Archive className="size-10" />,
    menu: "Inventory ",
    url: "/dashboard/manage-inventory",
  },
  {
    id: 5,
    icon: <BadgePercent className="size-10" />,
    menu: "Discount ",
    url: "/dashboard/manage-discount",
  },
  {
    id: 6,
    icon: <ChartLine className="size-10" />,
    menu: "Report and Analysis",
    url: "/dashboard/manage-reporting",
  },
];

export function AppSidebar({ className }: IAppSidebar) {
  const { open } = useSidebar();
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      className={`
     ${className} flex flex-col  `}
    >
      <SidebarContent className="p-3 flex-1 ">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="p-0 ">
              Navigation Bar
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.id}
                    className={`rounded-md ${
                      isActive ? "bg-muted text-primary font-medium" : ""
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center cursor-pointer
    ${open ? "gap-x-3 justify-start" : "justify-center"}`}
                      >
                        {item.icon}
                        {open && <span>{item.menu}</span>}
                      </Link>
                    </SidebarMenuButton>
                    {open && (
                      <SidebarMenuAction>
                        <ChevronRight className="size-4 cursor-pointer" />
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
