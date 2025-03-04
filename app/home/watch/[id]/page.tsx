"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";

const WatchVideo: React.FC = () => {
  const { id } = useParams(); // Get video ID from URL
  const searchParams = useSearchParams(); // Get query params

  // Extract values from search params
  const title = searchParams.get("title") || "Unknown Title";
  const views = searchParams.get("views") || "0";
  const channelName = searchParams.get("channel") || "Unknown Channel";
  const videoUrl = searchParams.get("videoUrl") || "/video.mp4";
  const thumbnail = searchParams.get("thumbnail") || "/placeholder.jpg";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {/* Left Section (Video Player) */}
      <div className="w-full md:w-[70%] flex flex-col p-4">
        <video controls className="w-full h-auto max-h-[80vh] rounded-lg">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Title & Metadata */}
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <p className="text-sm text-mutedText">{views} views</p>

        {/* Channel Info */}
        <div className="flex items-center mt-2">
          <Image
            src={thumbnail}
            alt={channelName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <p className="ml-3 text-md font-medium">{channelName}</p>
        </div>
      </div>

      {/* Right Section (Comments / Recommendations) */}
      <div className="w-full md:w-[30%] p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Recommended Videos</h2>
        <div className="space-y-3">
          <div className="p-2 h-40 w-auto bg-secondary border border-gray-800 rounded-md">
            Video 1
          </div>
          <div className="p-2 h-40 w-auto bg-secondary border border-gray-800 rounded-md">
            Video 2
          </div>
          <div className="p-2 h-40 w-auto bg-secondary border border-gray-800 rounded-md">
            Video 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
