"use client";

import { useState } from "react";
import Image from "next/image";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { tippingContractAbi, tippingContractAddress } from "@/lib/constants";
import toast, { Toaster } from "react-hot-toast";

interface TipModalProps {
    isOpen: boolean;
    onClose: () => void;
    uploader: `0x${string}`;
    uploaderName: string;
    uploaderPicCID: string;
    userProfilePicCID: string;
    username: string;
}

export default function TipModal({
    isOpen,
    onClose,
    uploader,
    uploaderName,
    uploaderPicCID,
    userProfilePicCID,
    username,
}: TipModalProps) {
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    const quickAmounts = ["0.001", "0.002", "0.005", "0.01", "0.02"];

    const { writeContract, isPending, isError } = useWriteContract();

    const handleTip = async () => {
        if (!writeContract || !amount) return;

        const toastId = toast.loading("Processing tip...", {
            style: { background: "#7C3AED", color: "#fff" }, // bg-accent
        });

        try {
            await writeContract({
                address: tippingContractAddress as `0x${string}`,
                abi: tippingContractAbi,
                functionName: "tipUploader",
                args: [uploader, message, username, userProfilePicCID],
                value: parseEther(amount),
            });

            toast.success("Tip sent successfully! 🎉", {
                id: toastId,
                style: { background: "#7C3AED", color: "#fff" }, // bg-accent
            });

            setAmount(""); // Clear input
            setMessage(""); // Clear message
        } catch (error) {
            toast.error("Transaction failed. Try again.", {
                id: toastId,
                style: { background: "#F87171", color: "#fff" }, // Red for errors
            });
            console.error("Transaction failed:", error);
        }
    };

    return (
        <>
            <Toaster position="top-center" />

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-lg border border-gray-700 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg sm:text-xl font-heading font-semibold text-white">💸 Send a Tip</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-2xl">
                                &times;
                            </button>
                        </div>

                        {/* Uploader Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-600 relative">
                                <Image
                                    src={uploaderPicCID}
                                    alt="Uploader"
                                    width={48}
                                    height={48}
                                    className="object-cover rounded-full h-full w-full"
                                    quality={100}
                                    priority
                                />
                            </div>
                            <div>
                                <h3 className="text-md sm:text-lg font-heading font-semibold text-white">{uploaderName}</h3>
                                <p className="text-xs sm:text-xs font-body truncate text-gray-400 max-w-[150px]">{uploader}</p>
                            </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {quickAmounts.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(amt)}
                                    className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-xs sm:text-sm"
                                >
                                    {amt} ETH
                                </button>
                            ))}
                        </div>

                        {/* Tip Amount Input */}
                        <div className="space-y-2">
                            <input
                                type="number"
                                placeholder="Enter custom amount (ETH)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="font-body p-2 sm:p-3 border border-gray-600 bg-gray-800 text-white rounded w-full focus:ring focus:ring-accent/50 placeholder-gray-400"
                            />
                            <p className="text-xs text-gray-400">*Gas fees will be added to the total transaction cost.</p>
                        </div>

                        {/* Message Input */}
                        <textarea
                            placeholder="Leave a message (optional)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="font-body p-2 sm:p-3 border border-gray-600 bg-gray-800 text-white rounded w-full h-20 sm:h-24 focus:ring focus:ring-accent/50 placeholder-gray-400"
                        />

                        {/* Tip Button */}
                        <button
                            onClick={handleTip}
                            disabled={isPending}
                            className="font-body w-full py-2 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition text-md sm:text-lg"
                        >
                            {isPending ? "Processing..." : "🔥 Send Tip"}
                        </button>

                        {isError && <p className="text-red-500 text-xs sm:text-sm mt-2">Transaction failed. Try again.</p>}
                    </div>
                </div>
            )}
        </>
    );
}
