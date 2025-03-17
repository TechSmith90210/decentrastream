"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import { profileContractAddress, profileContractAbi } from "@/lib/constants";
import WalletAvatar from "@/app/home/components/walletavatar";
import { Edit2, RefreshCcw } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

// Utility function to generate a random username
const generateUsername = (): string => {
    const adjectives = ["crypto", "web3", "nft", "onchain", "blockchain", "degen", "metaverse"];
    const nouns = ["ape", "whale", "punk", "wizard", "dev", "hodler", "builder"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
};

const CreateProfilePage = () => {
    const router = useRouter();
    const { address } = useAccount();
    const { data: txData, writeContract } = useWriteContract();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicCID, setProfilePicCID] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadToPinata = async (file: File): Promise<string> => {
        const toastId = toast.loading("Uploading image to IPFS...");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
            formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

            const { data } = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (!data.IpfsHash) throw new Error("Failed to upload to Pinata");

            toast.success("Image uploaded successfully!", { id: toastId });
            return `ipfs://${data.IpfsHash}`;
        } catch (error) {
            toast.error("Image upload failed!", { id: toastId });
            throw error;
        }
    };

    const handleCreateProfile = async () => {
        if (!username.trim()) return toast.error("Username is required!");
        if (!bio.trim()) return toast.error("Bio is required!");

        setIsLoading(true);
        const toastId = toast.loading("Creating profile...");

        try {
            let cid = profilePicCID;
            if (image) {
                cid = await uploadToPinata(image);
                setProfilePicCID(cid);
            }

            await writeContract({
                address: profileContractAddress as `0x${string}`,
                abi: profileContractAbi,
                functionName: "createProfile",
                args: [username, bio, cid],
            });

            toast.success("Profile created successfully!", { id: toastId });
        } catch {
            toast.error("Failed to create profile!", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (txData) {
            toast.success("Transaction confirmed! Redirecting...");
            router.push("/home");
        }
    }, [txData, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
            <div className="bg-secondary p-6 rounded-lg shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-lg font-bold mb-4 font-heading">🚀 Claim Your Web3 Identity</h1>
                <h6 className="text-mutedText text-center mb-4 w-full font-body">
                    One profile. Fully on-chain. Yours forever.
                </h6>

                {/* Profile Picture */}
                <label className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer bg-accent/20">
                    {previewUrl ? (
                        <Image src={previewUrl} alt="Thumbnail Preview" width={160} height={160} className="w-full h-full object-cover" />
                    ) : (
                        address && <WalletAvatar address={address} size={96} />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Edit2 size={20} />
                    </div>
                </label>

                {/* Username Input with @ prefix & Random Generator */}
                <div className="flex items-center w-full relative mb-3">
                    <span className="absolute left-3 text-mutedText font-body">@</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="font-body w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-4 py-2 pl-7 focus:ring-accent focus:border-accent"
                    />
                    <button
                        type="button"
                        className="absolute right-2 p-1 bg-accent/20 text-accent rounded-lg hover:bg-accent/40 transition-all"
                        onClick={() => setUsername(generateUsername())}
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>

                {/* Bio Input */}
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself (mandatory)"
                    className="font-body w-full bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-4 py-2 mb-4 focus:ring-accent focus:border-accent resize-none"
                    rows={3}
                />

                {/* Create Profile Button */}
                <button
                    className="font-body w-full bg-accent hover:bg-accent/60 text-white font-semibold py-2 text-sm rounded-lg transition-all"
                    onClick={handleCreateProfile}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Profile"}
                </button>
            </div>
        </div>
    );
};

export default CreateProfilePage;
