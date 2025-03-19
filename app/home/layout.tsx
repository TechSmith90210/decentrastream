import React from "react";
import SideBar, { SideBarItem } from "./components/sidebar";
import Navbar from "./components/navbar";
import { Home, Upload, Settings, 
    // Flame

} from "lucide-react";
import BottomNavbar from "./components/bottomNavBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-auto">
      {/* Sidebar */}
    
    <div className="block sm:hidden md:block">
    <SideBar>
        <SideBarItem text="Home" icon={<Home />} active />
        <SideBarItem text="Upload" icon={<Upload />} active={false} />
        {/* <SideBarItem text="Trending" icon={<Flame />} active={false} /> */}
        <SideBarItem text="Settings" icon={<Settings />} active={false} />
      </SideBar>
    </div>
      

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:pb-16 md:pb-3 bg-background">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background text-foreground pb-14"> {/*added padding for main content*/}
          {children}
        </main>
        {/* Bottom Navbar (shown on small screens) */}
      <div className="md:hidden relative bg-transparent">
        <BottomNavbar />
      </div>
      </div>
    </div>
  );
};

export default Layout;