import React from "react";
import {
  Home, Upload, Settings
} from "lucide-react";
import SideBar, { SideBarItem } from "../home/components/sidebar";
import Navbar from "../components/navbar";
import BottomNavbar from "../home/components/bottomNavBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-auto">
      {/* Sidebar */}

      <div className="block sm:hidden md:block">
        <SideBar>
          <SideBarItem text="Home" icon={<Home />} active={false} />
          <SideBarItem text="Upload" icon={<Upload />} active />
          {/* <SideBarItem text="Trending" icon={<Flame />} active={false} /> */}
          <SideBarItem text="Settings" icon={<Settings />} active={false} />
        </SideBar>
      </div>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:pb-16 md:pb-3 bg-background">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background text-foreground md:pb-12"> {/*added padding for main content*/}
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