"use client";

import { useState, useEffect } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";

interface WalletAvatarProps {
  address: string;
  size?: number;
}

export default function WalletAvatar({ address, size = 24 }: WalletAvatarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures hydration doesn't break
  }, []);

  if (!isClient) return null; // Avoid rendering on the server side

  return <MetaMaskAvatar address={address} size={size} />;
}
