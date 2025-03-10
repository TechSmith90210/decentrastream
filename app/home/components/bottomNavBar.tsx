"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Upload,
  Settings,
  // Flame
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home },
  { label: "Upload", icon: Upload },
  // { label: "Trending", icon: Flame },
  { label: "Settings", icon: Settings },
];

const BottomNavbar: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (label: string) => {
    const formattedText = label.toLowerCase();
    const path = formattedText === "home" ? "/home" : `/${formattedText}`;
    router.push(path);
  };

  return (
    <nav
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 w-auto px-4 py-2 
      flex justify-around items-center gap-4 rounded-full shadow-md backdrop-blur-md bg-secondary/80
      transition-all duration-300 ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      {navItems.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => handleNavigation(label)}
          className="p-2 rounded-full transition hover:bg-secondary/50"
        >
          <Icon className="w-6 h-6 text-foreground" />
        </button>
      ))}
    </nav>
  );
};

export default BottomNavbar;
