"use client";

import { useEffect, useState } from "react"; // Import useState and useEffect
import { useSearchParams } from "next/navigation"; // Use useSearchParams for accessing query params
import Image from "next/image";

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

  const { videoUrl, title, description, thumbnailUrl, owner } = videoData;
  const videoSrc = getIPFSUrl(videoUrl); // Construct the video URL for IPFS

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <div className="w-full md:w-[70%] flex flex-col p-4">
        <video controls autoPlay className="w-full h-auto max-h-[80vh] rounded-lg">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="text-2xl font-bold mt-4">{title || "Untitled Video"}</h1>
        <p className="text-sm text-mutedText">{description || "No description available"}</p>
        <div className="flex items-center mt-2">
          <Image
            src={thumbnailUrl || "/profile.png"}
            alt={title || "Video Thumbnail"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          {owner}
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
