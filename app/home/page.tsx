"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { VideoGridItem } from "./components/videoGridItem";
import { contractAddress, contractAbi } from "../../lib/constants";
import { VideoGridItemProps } from "@/lib/types";
import { VideoDataFromContract } from "@/lib/types";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [videos, setVideos] = useState<VideoGridItemProps[]>([]);

  // Memoize formatIPFSUrl with useCallback to avoid unnecessary re-renders
  const formatIPFSUrl = useCallback((cid?: string): string => {
    const cleanCID = (cid?: string) => cid ? cid.replace(/^ipfs:\/\//, "").trim() : "";
    return cid ? `https://ipfs.io/ipfs/${cleanCID(cid)}` : "/placeholder.jpg";
  }, []);

  // Fetch videos from the smart contract
  const {
    data: fetchedVideos,
    isLoading,
    refetch,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "getAllVideos",
  });

  // Utility function to clean "ipfs://" prefix from CIDs
  const cleanCID = (cid?: string) =>
    cid ? cid.replace(/^ipfs:\/\//, "").trim() : "";

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Debug: Log fetched video data
  useEffect(() => {
    console.log("Fetched Videos from Contract:", fetchedVideos);
    if (!fetchedVideos) {
      console.warn("No videos fetched. Retrying...");
      refetch(); // Try refetching if no data is returned
    }
  }, [fetchedVideos, refetch]);

  // Process and store video data
  useEffect(() => {
    if (Array.isArray(fetchedVideos)) {
      const formattedVideos: VideoGridItemProps[] = fetchedVideos.map(
        (video: VideoDataFromContract, index: number) => {
          const cleanedVideoCID = cleanCID(video.videoCID);
          const cleanedThumbnailCID = cleanCID(video.thumbnailCID);

          return {
            id: String(video.id) || `fallback-${index}`, // Convert BigInt to string
            title: video.title || "Untitled Video",
            duration: String(video.timestamp) || "Unknown", // Convert BigInt to 
            description: video.description || "",
            channel: {
              id: String(video.id) || "0", // Convert BigInt to string
              name: video.owner || "Unknown Uploader",
              profileUrl: "/profile.png",
            },
            videoUrl: cleanedVideoCID, // Store just the CID (not full URL)
            thumbnailurl: formatIPFSUrl(cleanedThumbnailCID),
            postedAt: "Recently",
            owner: video.owner || "0x0",
            timestamp: video.timestamp,
            videoCID: cleanedVideoCID,
          };
        }
      );

      setVideos(formattedVideos);
    } else {
      console.warn("Fetched Videos is not an array:", fetchedVideos);
    }
  }, [fetchedVideos, formatIPFSUrl]); // `formatIPFSUrl` is now memoized

  return (
    <div className="bg-background p-8 min-h-[100dvh] flex flex-col">
      <h1 className="text-foreground font-heading text-3xl">Popular Videos</h1>

      {isLoading ? (
        <p className="text-gray-400">Loading videos...</p>
      ) : videos.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 gap-4">
          {videos.map((video) => (
            <VideoGridItem
              key={video.id}
              {...video}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No videos uploaded yet.</p>
      )}
    </div>
  );
};

export default HomePage;
