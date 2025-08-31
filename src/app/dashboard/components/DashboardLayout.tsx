"use client";
import { useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import MobileNavbarDashboard from "./MobileNavbarDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import CustomSidebarTrigger from "./CustomSidebarTrigger";
import DashboardContent from "./DashboardContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <section className="bg-green-100/40 flex flex-col h-full">
      {/* Header */}
      <header className="">
        <DashboardNavbar />
        <MobileNavbarDashboard className="md:hidden" />
      </header>
      {/* Sidebar and Content */}
      <SidebarProvider
        open={openSidebar}
        onOpenChange={() => setOpenSidebar((prev) => !prev)}
      >
        <AppSidebar className="" />
        <main className=" flex flex-col md:px-5 ">
          <div id="sidebartrigger" className="flex items-center">
            <CustomSidebarTrigger />
          </div>

          <div className="p-2  w-full h-[90vh]">{children}</div>
        </main>
      </SidebarProvider>
      {/* Footer */}
      <footer className="bg-red-500 w-full h-20">This is footer</footer>
    </section>
  );
}
