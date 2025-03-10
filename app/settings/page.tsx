"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useDisconnect, useChainId, useBalance } from "wagmi";
import { Copy, LogOut, Sun, Moon, Video, Shield, Globe } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [darkMode, setDarkMode] = useState(false);
  const [videoQuality, setVideoQuality] = useState("Auto");
  const [uploadPrivacy, setUploadPrivacy] = useState("Public");
  const [web3Enabled, setWeb3Enabled] = useState(true);

  // Fetch Sepolia Balance
  const { data: balanceData, isLoading, error } = useBalance({
    address: address || undefined,
    chainId: 11155111, // Sepolia Testnet Chain ID
  });

  useEffect(() => {
    console.log("Wallet Address:", address);
    console.log("Current Chain ID:", chainId);
    console.log("Balance Data:", balanceData);
    console.log("Balance Fetch Error:", error);
  }, [address, chainId, balanceData, error]);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleCopy = () => {
    if (address) navigator.clipboard.writeText(address);
  };

  return (
    <div className="p-4 mb-20 sm:mb-0 sm:pb-10 md:pb-3 md:p-8 min-h-[100dvh] flex flex-col gap-6 bg-background text-foreground max-w-4xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>

      {/* Account Details */}
      <div className="p-4 bg-secondary rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="text-left">
          <p className="text-sm text-mutedText">Connected Wallet</p>
          <p className="text-lg font-medium break-all">
            {address || "Not Connected"}
          </p>
          <p className="text-sm text-mutedText">
            {chainId ? `Chain ID: ${chainId}` : "Unknown Network"}
          </p>
          <h6 className="text-lg text-accent">
            {isLoading
              ? "Fetching Balance..."
              : error
              ? `Error fetching balance: ${error.message}`
              : balanceData
              ? `${balanceData.formatted} ${balanceData.symbol}`
              : "Balance not available"}
          </h6>
        </div>
        {address && (
          <button
            onClick={handleCopy}
            className="text-mutedText hover:text-white transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Theme Toggle */}
      <div className="p-4 bg-secondary rounded-lg shadow-md flex justify-between items-center w-full">
        <span className="text-lg">Theme</span>
        <button
          onClick={toggleTheme}
          className="p-2 bg-accent rounded-lg hover:bg-accent/60 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Video Quality */}
      <div className="p-4 bg-secondary rounded-lg shadow-md flex justify-between items-center w-full">
        <span className="text-lg flex items-center gap-2">
          <Video className="w-5 h-5" /> Video Quality
        </span>
        <select
          className="p-2 bg-secondary rounded-lg border border-mutedText text-white"
          value={videoQuality}
          onChange={(e) => setVideoQuality(e.target.value)}
        >
          <option>Auto</option>
          <option>1080p</option>
          <option>720p</option>
          <option>480p</option>
          <option>360p</option>
        </select>
      </div>

      {/* Upload Privacy */}
      <div className="p-4 bg-secondary rounded-lg shadow-md flex justify-between items-center w-full">
        <span className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" /> Default Upload Privacy
        </span>
        <select
          className="p-2 bg-secondary rounded-lg border border-mutedText text-white"
          value={uploadPrivacy}
          onChange={(e) => setUploadPrivacy(e.target.value)}
        >
          <option>Public</option>
          <option>Unlisted</option>
          <option>Private</option>
        </select>
      </div>

      {/* Web3 Features Toggle */}
      <div className="p-4 bg-secondary rounded-lg shadow-md flex justify-between items-center w-full">
        <span className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5" /> Enable Web3 Features
        </span>
        <button
          onClick={() => setWeb3Enabled(!web3Enabled)}
          className={`p-2 rounded-lg transition-colors ${
            web3Enabled ? "bg-success" : "bg-mutedText"
          }`}
        >
          {web3Enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      {/* Logout Button */}
      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="mt-6 md:mt-8 flex items-center justify-center gap-2 px-4 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      )}
    </div>
  );
};

export default SettingsPage;
