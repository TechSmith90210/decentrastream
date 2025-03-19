"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WalletAvatar from "../../components/walletavatar";
import { useReadContract } from "wagmi";
import { profileContractAddress, profileContractAbi } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

// Function to generate correct IPFS gateway URL
const getIPFSUrl = (cid: string) => cid ? `https://ipfs.io/ipfs/${cid.replace("ipfs://", "")}` : null;

const WatchVideo: React.FC = () => {
  interface VideoData {
    videoUrl: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    owner: string;
  }

  interface ProfileData {
    username: string;
    profilePicCID: string | null;
  }

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>({ username: "", profilePicCID: null });

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const videoUrl = searchParams.get("videoUrl");
      const title = searchParams.get("title");
      const description = searchParams.get("description");
      const thumbnailurl = searchParams.get("thumbnailurl");
      const owner = searchParams.get("owner");
  
      if (videoUrl && title && description && thumbnailurl && owner) {
        const decodedVideoData = {
          videoUrl: decodeURIComponent(videoUrl),
          title: decodeURIComponent(title),
          description: decodeURIComponent(description),
          thumbnailUrl: decodeURIComponent(thumbnailurl),
          owner: decodeURIComponent(owner),
        };
  
        console.log("Fetched Video Data:", decodedVideoData); // Log the video data
  
        setVideoData(decodedVideoData);
      }
      setLoading(false);
    }
  }, [searchParams]);
  

  // Fetch owner profile using `useReadContract`
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [videoData?.owner], // Use the video owner's address
  });

  useEffect(() => {
    if (profile) {
      console.log("Fetched profile data:", profile);

      const { username, profilePicCID } = profile as ProfileData;

      setProfileData({
        username,
        profilePicCID: profilePicCID ? getIPFSUrl(profilePicCID) : null,
      });
    }
  }, [profile]);

  if (loading) {
    return <p className="text-blue-500">Loading...</p>;
  }

  if (!videoData) {
    return <p className="text-red-500">Error: Video data is missing.</p>;
  }

  const { videoUrl, title, description } = videoData;
  const videoSrc = videoUrl;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground p-4">
      {/* Left Section - Video & Details */}
      <div className="w-full md:w-[70%] flex flex-col space-y-2">
        <video controls autoPlay className="w-full h-auto max-h-[70vh] rounded-lg shadow-lg">
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>

        <h1 className="text-2xl font-bold">{title || "Untitled Video"}</h1>
        <p className="text-sm text-mutedText">{description || "No description available"}</p>

        {/* Owner Section */}
        <Link href={`/profile/${profileData.username}`} className="flex items-center gap-4 pt-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {profileData.profilePicCID ? (
              <Image
                src={profileData.profilePicCID}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
                quality={100} // Ensures high quality
                priority // Loads the image ASAP
              />
            ) : (
              <WalletAvatar address={videoData.owner} size={30} />
            )}
          </div>
          <h6 className="text-sm font-medium">@{profileData.username || videoData.owner}</h6>
        </Link>

      </div>

      {/* Right Section - Comments */}
      <div className="w-full md:w-[30%] mt-6 md:mt-0 md:pl-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>

        {/* Comment List */}
        <div className="bg-secondary p-4 rounded-lg shadow max-h-[60vh] overflow-y-auto space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-md">
            <WalletAvatar address="0x708bF486eb80d4fd1B6a8167F1A148fFa89870cA" size={30} />
            <div>
              <h5 className="text-sm text-foreground font-medium">@Johnnascus</h5>
              <p className="text-sm text-mutedText">Great video! 🔥</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-md">
            <WalletAvatar address="0x708bF486eb80d4fd1B6a8167F1A148fFa89870cA" size={30} />
            <div>
              <h5 className="text-sm text-foreground font-medium">@2hollis</h5>
              <p className="text-sm text-mutedText">What a clean and minimal UI, Amazing!</p>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 p-2 bg-secondary text-white rounded-l-md outline-none text-sm"
          />
          <button className="px-3 bg-accent text-white rounded-r-md hover:bg-opacity-80 text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
