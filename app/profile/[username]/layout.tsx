"use client";
import React from "react";
import { Home, Upload, Settings } from "lucide-react";
import SideBar, { SideBarItem } from "@/app/home/components/sidebar";
import Navbar from "@/app/home/components/navbar";
import BottomNavbar from "@/app/home/components/bottomNavBar";
import { usePathname } from "next/navigation"; // Add usePathname

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Get current pathname

  return (
    <div className="flex h-screen overflow-auto">
      {/* Sidebar */}
      <div className="block sm:hidden md:block">
        <SideBar>
          <SideBarItem text="Home" icon={<Home />} active={pathname === "/home"} />
          <SideBarItem text="Upload" icon={<Upload />} active={pathname === "/upload"} />
          <SideBarItem text="Settings" icon={<Settings />} active={pathname === "/settings"} />
        </SideBar>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:pb-16 md:pb-3 bg-background">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background text-foreground md:pb-12">
          {children}
        </main>

        {/* Bottom Navbar (shown on small screens) */}
        <div className="md:hidden bg-transparent">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
};

export default Layout;