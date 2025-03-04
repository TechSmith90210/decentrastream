"use client";
import { motion } from "framer-motion";
import ConnectBtn from "./ConnectBtn";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-start justify-start h-[92vh] w-full text-left overflow-hidden p-8 bg-background">
      {/* Optimized Background Animation */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-40 blur-3xl"
        initial={{ opacity: 0.3, scale: 1 }}
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtitle */}
      <motion.h4
        className="text-gray-300 text-xl font-body relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Own your content. Get rewarded. No middlemen.
      </motion.h4>

      {/* Optimized Title Animation */}
      <motion.h1
        className="text-8xl font-heading text-white mt-4 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        The Future of Video, <br /> Decentralized
      </motion.h1>

      {/* Connect Button - Correct Animation */}
      <motion.div
        className="relative z-10 mt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }} // ✅ Ensures smooth appearance
      >
        <ConnectBtn />
      </motion.div>

      {/* MetaMask Requirement Text Animation */}
      <motion.p
        className="text-xs text-mutedText text-center mt-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }} // ✅ Appears after button
      >
        *Requires MetaMask account
      </motion.p>
    </div>
  );
}
