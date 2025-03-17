"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useHasProfile } from "@/lib/utils";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  const { data: hasProfile, isLoading } = useHasProfile(address);

  useEffect(() => {
    console.log("isConnected:", isConnected);
    console.log("isLoading:", isLoading);
    console.log("hasProfile:", hasProfile);
    console.log("pathname:", pathname);

    if (!isConnected) {
      router.replace("/");
      return;
    }

    if (isLoading) return; // ✅ Wait until profile check is done

    if (!hasProfile && pathname !== "/profile/create") {
      router.replace("/profile/create");
    } else if (hasProfile && pathname === "/") {
      router.replace("/home");
    }
  }, [isConnected, isLoading, hasProfile, pathname, router]);

  // ✅ Show "Checking Profile" only when loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
        <p className="text-gray-400 text-center mt-4">Checking profile...</p>
      </div>
    );
  }

  return <>{children}</>;
}
