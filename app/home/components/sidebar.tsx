"use client";

import Image from "next/image";
import { AlignJustify } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import WalletAvatar from "./walletavatar";
import { profileContractAddress, profileContractAbi } from "@/lib/constants";

// Define the expected return type of the getProfile function
type ProfileData = {
  username: string;
  profilePicCID?: string | null;
};

const SideBarContext = createContext({ expanded: true });

export default function SideBar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const { address } = useAccount(); // Get connected wallet address

  // Fetch profile data using `useReadContract`
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [address],
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  });

  // Update state when profile data is fetched
  useEffect(() => {
    if (profile) {
      console.log("Fetched profile data:", profile);

      const { username, profilePicCID } = profile as ProfileData;

      // Ensure the CID is formatted correctly for IPFS gateway
      const formattedCID = profilePicCID?.replace("ipfs://", "");

      setProfileData({
        username,
        profilePicCID: formattedCID ? `https://ipfs.io/ipfs/${formattedCID}` : null,
      });
    }
  }, [profile]);

  return (
    <aside
      className={`h-screen bg-secondary border-r border-gray-700 shadow-sm fixed top-0 left-0 z-40 transition-transform
        ${expanded ? "translate-x-0" : "-translate-x-full"} sm:relative sm:translate-x-0`}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
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

          <button
            onClick={() => setExpanded((value) => !value)}
            className="py-2 px-2 rounded-md text-foreground hover:bg-gray-800"
          >
            <AlignJustify />
          </button>
        </div>

        <SideBarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
            {address && (
              <SideBarItem
                text={profileData.username ? `@${profileData.username}` : "Profile"}
                icon={
                  profileData.profilePicCID ? (
                    <Image
                      src={profileData.profilePicCID}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <WalletAvatar address={address} size={24} />
                  )
                }
                active={false}
              />
            )}
          </ul>
        </SideBarContext.Provider>
      </nav>
    </aside>
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
    const formattedText = text.toLowerCase().replace("@", "");
    const path = formattedText === "home" ? "/home" : `/${formattedText}`;
    router.push(path);
  };

  return (
    <li
      className={`relative flex items-center mt-4 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${active ? "bg-accent text-foreground" : "hover:bg-gray-800 text-mutedText"}
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
