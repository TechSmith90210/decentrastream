"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Upload, Settings, CircleUserRound } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { profileContractAddress, profileContractAbi } from "@/lib/constants";
import Image from "next/image";

type ProfileData = {
  username: string;
  profilePicCID?: string | null;
};

const navItems = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Upload", path: "/upload", icon: Upload },
  { label: "Settings", path: "/settings", icon: Settings },
];

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { address } = useAccount();

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  });

  // Fetch profile data
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Fetch only when address is available
    },
  });

  // Update state when profile data is available
  useEffect(() => {
    if (profile) {
      console.log("Fetched profile data:", profile);
      const { username, profilePicCID } = profile as ProfileData;

      // Ensure the CID is formatted correctly for IPFS
      const formattedCID = profilePicCID?.replace("ipfs://", "");
      setProfileData({
        username,
        profilePicCID: formattedCID ? `https://ipfs.io/ipfs/${formattedCID}` : null,
      });
    }
  }, [profile]);

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-mutedText shadow-lg">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = pathname.startsWith(path);

          return (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className="flex flex-col items-center justify-center p-2"
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-blue-500" : "text-mutedText"}`} />
              <span className={`text-xs font-heading ${isActive ? "text-blue-500 font-semibold" : "text-mutedText"}`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* Profile Button */}
        <button
          onClick={() => handleNavigation(profileData.username ? `/profile/${profileData.username}` : "/profile")}
          className="flex flex-col items-center justify-center p-2"
        >
          {profileData.profilePicCID ? (
            <Image
              src={profileData.profilePicCID}
              alt="Profile"
              width={28}
              height={28}
              className={`rounded-full border-2 ${pathname.startsWith("/profile") ? "border-blue-500" : "border-mutedText"}`}
            />
          ) : (
            <CircleUserRound className={`w-6 h-6 ${pathname.startsWith("/profile") ? "text-blue-500" : "text-mutedText"}`} />
          )}
          <span className={`text-xs font-heading ${pathname.startsWith("/profile") ? "text-blue-500 font-semibold" : "text-mutedText"}`}>
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
