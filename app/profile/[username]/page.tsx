"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useReadContract, useAccount } from "wagmi";
import {
  VideoGridItemProps,
  VideoDataFromContract,
} from "@/lib/types";
import {
  videoContractAbi,
  videoContractAddress,
  profileContractAbi,
  profileContractAddress,
} from "@/lib/constants";
import { VideoGridItem } from "@/app/home/components/videoGridItem";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type ProfileData = {
  username: string;
  bio: string;
  profilePicCID: string | null;
  createdAt: number | null;
};

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { address: loggedInAddress } = useAccount(); // Get logged-in user's wallet address

  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    bio: "No bio available.",
    profilePicCID: null,
    createdAt: null,
  });
  const [videos, setVideos] = useState<VideoGridItemProps[]>([]);
  const [isMyProfile, setIsMyProfile] = useState(false); // Check if this is the logged-in user's profile

  // Fetch the address by username
  const { data: fetchedAddress } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getAddressByUsername",
    args: [username || ""],
    query: { enabled: !!username },
  });

  // Fetch the user's profile details using the resolved address
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [resolvedAddress || "0x0000000000000000000000000000000000000000"],
  });

  // Fetch all videos from the VideoContract
  const { data: fetchedVideos, isLoading } = useReadContract({
    address: videoContractAddress as `0x${string}`,
    abi: videoContractAbi,
    functionName: "getAllVideos",
  });

  useEffect(() => {
    if (fetchedAddress) {
      setResolvedAddress(fetchedAddress as string);
    }
  }, [fetchedAddress]);

  useEffect(() => {
    if (resolvedAddress && loggedInAddress) {
      setIsMyProfile(resolvedAddress.toLowerCase() === loggedInAddress.toLowerCase());
    }
  }, [resolvedAddress, loggedInAddress]);

  useEffect(() => {
    if (profile) {
      const { username, bio, profilePicCID, createdAt } = profile as ProfileData;
      const formattedCID = profilePicCID?.replace("ipfs://", "");
      setProfileData({
        username,
        bio,
        profilePicCID: formattedCID ? `https://ipfs.io/ipfs/${formattedCID}` : null,
        createdAt: Number(createdAt) * 1000,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (Array.isArray(fetchedVideos) && resolvedAddress) {
      const userVideos: VideoGridItemProps[] = fetchedVideos
        .filter(
          (video: VideoDataFromContract) =>
            video.owner.toLowerCase() === resolvedAddress.toLowerCase()
        )
        .map((video: VideoDataFromContract) => ({
          id: String(video.id),
          title: video.title || "Untitled Video",
          duration: String(video.timestamp) || "Unknown",
          description: video.description || "",
          channel: {
            id: String(video.id),
            name: video.owner || "Unknown Uploader",
            profileUrl: profileData.profilePicCID || "/avatar.jpg",
          },
          videoUrl: `https://ipfs.io/ipfs/${video.videoCID.replace("ipfs://", "")}`,
          thumbnailurl: `https://ipfs.io/ipfs/${video.thumbnailCID.replace("ipfs://", "")}`,
          postedAt: "Recently",
          owner: video.owner,
          timestamp: video.timestamp,
          videoCID: `https://ipfs.io/ipfs/${video.videoCID.replace("ipfs://", "")}`,
        }));

      setVideos(userVideos);
    }
  }, [fetchedVideos, resolvedAddress, profileData]);

  return (
    <div className="bg-background p-8 min-h-[100dvh] flex flex-col">
      {/* Profile Header */}
      {profileData.username ? (
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={profileData.profilePicCID || "/avatar.jpg"}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-foreground font-heading text-3xl">
              {profileData.username} {isMyProfile && "(You)"}
            </h1>
            <p className="text-gray-400">{profileData.bio}</p>
            <h5 className="text-mutedText text-sm font-body">
              Joined {dayjs(profileData.createdAt).format("MMMM DD, YYYY")}
            </h5>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading profile...</p>
      )}

      {/* Show "Edit Profile" button if it's the logged-in user's profile */}
      {isMyProfile && (
        <button className="bg-primary text-white py-2 px-4 rounded-lg mb-4">
          Edit Profile
        </button>
      )}

      {/* Video Grid */}
      {isLoading ? (
        <p className="text-mutedText pt-3">Loading videos...</p>
      ) : videos.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 gap-4 pt-3">
          {videos
  .filter((video) => video.owner.toLowerCase() === resolvedAddress?.toLowerCase())
  .map((video) => <VideoGridItem key={video.id} {...video} />)}

        </div>
      ) : (
        <p className="text-gray-400">No videos uploaded yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
