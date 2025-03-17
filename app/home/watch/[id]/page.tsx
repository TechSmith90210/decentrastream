"use client";

import { useEffect, useState } from "react"; // Import useState and useEffect
import { useSearchParams } from "next/navigation"; // Use useSearchParams for accessing query params
import WalletAvatar from "../../components/walletavatar";
import { useAccount } from "wagmi";

// Function to generate correct IPFS gateway URL
const getIPFSUrl = (cid: string) => `https://ipfs.io/ipfs/${cid}`;

const WatchVideo: React.FC = () => {
  interface VideoData {
    videoUrl: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    owner: string;
  }

  const [videoData, setVideoData] = useState<VideoData | null>(null); // Store all video data
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const searchParams = useSearchParams();
  const { address } = useAccount(); // Get connected wallet address


  useEffect(() => {
    if (searchParams) {
      const videoUrl = searchParams.get('videoUrl');
      const title = searchParams.get('title');
      const description = searchParams.get('description');
      const thumbnailurl = searchParams.get('thumbnailurl');
      const owner = searchParams.get('owner');

      if (videoUrl && title && description && thumbnailurl && owner) {
        setVideoData({
          videoUrl: decodeURIComponent(videoUrl),
          title: decodeURIComponent(title),
          description: decodeURIComponent(description),
          thumbnailUrl: decodeURIComponent(thumbnailurl),
          owner: decodeURIComponent(owner),
        });
      }
      setLoading(false); // Set loading to false once params are processed
    }
  }, [searchParams]);

  if (loading) {
    return <p className="text-blue-500">Loading...</p>; // Show loading message while data is being processed
  }

  if (!videoData) {
    return <p className="text-red-500">Error: Video data is missing.</p>;
  }

  const { videoUrl, title, description, owner } = videoData;
  const videoSrc = getIPFSUrl(videoUrl); // Construct the video URL for IPFS

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground p-4">
      {/* Left Section - Video & Details */}
      <div className="w-full md:w-[70%] flex flex-col space-y-2">
        <video controls autoPlay className="w-full h-auto max-h-[70vh] rounded-lg shadow-lg">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        <h1 className="text-2xl font-bold">{title || "Untitled Video"}</h1>
        <p className="text-sm text-mutedText">{description || "No description available"}</p>
  
        {/* Owner Section */}
        <div className="flex items-center gap-4 pt-3">
          {address && <WalletAvatar address={address} size={30} />}
          <h6 className="text-sm font-medium">{owner}</h6>
        </div>
      </div>
  
      {/* Right Section - Comments */}
      <div className="w-full md:w-[30%] mt-6 md:mt-0 md:pl-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        
        {/* Comment List */}
        <div className="bg-secondary p-4 rounded-lg shadow max-h-[60vh] overflow-y-auto space-y-3">
          {/* Example Comments (Replace with Dynamic Data) */}
          <div className="flex flex-col p-3 bg-accent/15 rounded-md">
            <h5 className="text-sm text-foreground font-medium">Johnnascus</h5>
            <p className="text-sm text-mutedText">Great video! 🔥</p>
          </div>
          <div className="flex flex-col p-3 bg-accent/15 rounded-md">
            <h5 className="text-sm text-foreground font-medium">2hollis</h5>
            <p className="text-sm text-mutedText">What a clean and minimal UI, Amazing!</p>
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
