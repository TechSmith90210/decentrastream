"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Upload, Settings, Flame } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Upload", icon: Upload },
  { label: "Trending", icon: Flame },
  { label: "Settings", icon: Settings },
];

const BottomNavbar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (label: string) => {
    if (label === "Home") router.push("/home");
    else router.push(`/home/${label.toLowerCase()}`);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-secondary text-foreground p-4 flex justify-around">
      {navItems.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => handleNavigation(label)}
          className="flex flex-col items-center focus:outline-none"
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs pt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
