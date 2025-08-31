"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardContent from "./components/DashboardContent";
import DashboardNavbar from "./components/DashboardNavbar";
import MobileNavbarDashboard from "./components/MobileNavbarDashboard";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import CustomSidebarTrigger from "./components/CustomSidebarTrigger";
import DashboardLayout from "./components/DashboardLayout";

export default function Dashboard() {
  // const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <DashboardLayout>
      <DashboardContent className="p-2 border border-black w-full h-[90vh]" />
    </DashboardLayout>
  );
}
