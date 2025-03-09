"use client";
import { motion } from "framer-motion";
import ConnectBtn from "./ConnectBtn";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center sm:text-left sm:items-start h-[92vh] w-full overflow-hidden px-6 sm:px-8 md:px-12 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] animate-gradient">

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-0 left-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0)_70%)] blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Subtitle */}
      <motion.h4
        className="text-gray-400 text-base sm:text-lg md:text-xl font-body relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Own your content. Get rewarded. No middlemen.
      </motion.h4>

      {/* Title Animation - Responsive */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading text-white mt-4 relative z-10 leading-tight"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        The Future of Video, <br className="hidden sm:block" /> Decentralized
      </motion.h1>

      {/* Connect Button */}
      <motion.div
        className="relative z-10 mt-6 sm:mt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      >
        <ConnectBtn />
      </motion.div>

      {/* MetaMask Requirement Text */}
      <motion.p
        className="text-xs sm:text-sm text-gray-500 mt-2 relative z-10"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        *Requires MetaMask account
      </motion.p>

      {/* Animated Background Lights */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue-500 rounded-full blur-3xl opacity-20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
    </div>
  );
}
