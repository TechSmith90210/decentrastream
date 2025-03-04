import React from "react";
import SideBar, { SideBarItem } from "./components/sidebar";
import Navbar from "./components/navbar";
import { Home, Upload, Settings, Flame } from "lucide-react";
import BottomNavbar from "./components/bottomNavBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
    
    <div className="block sm:hidden md:block">
    <SideBar>
        <SideBarItem text="Home" icon={<Home />} active />
        <SideBarItem text="Upload" icon={<Upload />} active={false} />
        <SideBarItem text="Trending" icon={<Flame />} active={false} />
        <SideBarItem text="Settings" icon={<Settings />} active={false} />
      </SideBar>
    </div>
      

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 text-foreground"> {/*added padding for main content*/}
          {children}
        </main>
        {/* Bottom Navbar (shown on small screens) */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
      </div>
    </div>
  );
};

export default Layout;