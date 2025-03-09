"use client";

import Image from "next/image";
import { AlignJustify, LogOut } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";

const SideBarContext = createContext({ expanded: true });

export default function SideBar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const { disconnect } = useDisconnect(); // Wagmi hook for disconnecting MetaMask

  const handleLogout = () => {
    disconnect(); // Disconnect the wallet
  };

  return (
    <>
      <aside
        className={`h-screen bg-secondary border-r border-gray-700 shadow-sm fixed top-0 left-0 z-40 transition-transform
            ${
              expanded ? "translate-x-0" : "-translate-x-full"
            } sm:relative sm:translate-x-0`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Logo */}
            {expanded && (
              <div className="flex items-center">
                <Image
                  src="/DecentraStreamLogo.png"
                  alt="DecentraStream Logo"
                  height={60}
                  width={60}
                  className="transition-all"
                />
                <span className="text-md font-semibold text-foreground">
                  DecentraStream
                </span>
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setExpanded((value) => !value)}
              className="py-2 px-2 rounded-md text-foreground hover:bg-gray-800"
            >
              <AlignJustify />
            </button>
          </div>

          <SideBarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-start py-2 px-3 my-2 font-medium rounded-md text-red-500 hover:bg-gray-800 transition-all"
            >
              <LogOut />
              {expanded && <span className="ml-3">Logout</span>}
            </button>
          </SideBarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

export function SideBarItem({
  text,
  icon,
  active,
}: {
  text: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  const { expanded } = useContext(SideBarContext);
  const router = useRouter();

  const handleClick = () => {
    if (text === "Home") router.push("/home");
    else router.push(`/home/${text.toLowerCase()}`);
  };

  return (
    <li
      className={`relative flex items-center mt-4 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-accent text-foreground"
            : " hover:bg-gray-800 text-mutedText"
        }
      `}
      onClick={handleClick}
    >
      {icon}
      <span
        className={`text-sm font-body overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0 hidden"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className="absolute left-full ml-3 px-2 py-1 rounded-md bg-accent text-foreground text-sm opacity-0 
    transition-all translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-2 whitespace-nowrap"
        >
          {text}
        </div>
      )}
    </li>
  );
}
