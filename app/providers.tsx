"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && pathname === "/") {
      router.replace("/home"); // ✅ Redirect connected users from `/` to `/home`
    } else if (!isConnected && pathname !== "/") {
      router.replace("/"); // ✅ Redirect disconnected users to `/`
    }
  }, [isConnected, pathname, router]);

  return <>{children}</>;
}
