"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useReadContract, useAccount } from "wagmi";
import { VideoGridItemProps, VideoDataFromContract } from "@/lib/types";
import {
  videoContractAbi,
  videoContractAddress,
  profileContractAbi,
  profileContractAddress,
  tippingContractAbi,
  tippingContractAddress, 
} from "@/lib/constants";
import { VideoGridItem } from "@/app/home/components/videoGridItem";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NoVideosScreen from "@/app/components/noVideosScreen";
import NoTipsScreen from "@/app/components/noTipsScreen";

dayjs.extend(relativeTime);

type ProfileData = {
  username: string;
  bio: string;
  profilePicCID: string | null;
  createdAt: number | null;
};

type Tip = {
  sender: string;
  amount: bigint;
  message: string;
  username: string;
  profilePicCID: string;
};

const LoadingScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-mutedText">Loading...</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { address: loggedInAddress } = useAccount();

  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    bio: "No bio available.",
    profilePicCID: null,
    createdAt: null,
  });
  const [videos, setVideos] = useState<VideoGridItemProps[]>([]);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: fetchedAddress } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getAddressByUsername",
    args: [username || ""],
    query: { enabled: !!username },
  });

  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [resolvedAddress || "0x0000000000000000000000000000000000000000"],
  });

  const { data: fetchedVideos } = useReadContract({
    address: videoContractAddress as `0x${string}`,
    abi: videoContractAbi,
    functionName: "getAllVideos",
  });

  const { data: tipsData } = useReadContract({
    address: tippingContractAddress as `0x${string}`,
    abi: tippingContractAbi,
    functionName: "getTips",
    args: [resolvedAddress || "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!resolvedAddress },
  });

  useEffect(() => {
    if (fetchedAddress) setResolvedAddress(fetchedAddress as string);
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
        .filter((video: VideoDataFromContract) => video.owner.toLowerCase() === resolvedAddress.toLowerCase())
        .map((video: VideoDataFromContract) => ({
          id: String(video.id),
          title: video.title || "Untitled Video",
          duration: String(video.timestamp) || "Unknown",
          description: video.description || "",
          videoUrl: `https://ipfs.io/ipfs/${video.originalVideoCID.replace("ipfs://", "")}`,
          thumbnailurl: `https://ipfs.io/ipfs/${video.thumbnailCID.replace("ipfs://", "")}`,
          postedAt: "Recently",
          owner: video.owner,
          ownerProfilePic: profileData.profilePicCID || "unknown",
          timestamp: video.timestamp,
          videoCID: `https://ipfs.io/ipfs/${video.originalVideoCID.replace("ipfs://", "")}`,
          videoCids: video.videoCIDs,
        }));

      setVideos(userVideos);
    }
  }, [fetchedVideos, resolvedAddress, profileData]);

  useEffect(() => {
    if (tipsData) {
      setTips(tipsData as Tip[]);
    }
  }, [tipsData]);

  useEffect(() => {
    setLoading(!profileData.username && !videos.length && !tips.length);
  }, [profileData, videos, tips]);

  if (loading) return <LoadingScreen />;

  const totalTipsReceived = tips.reduce((acc, tip) => acc + Number(tip.amount) / 1e18, 0).toFixed(4);

  return (
    <div className="bg-background p-6 min-h-[100dvh] flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <Image
          src={profileData.profilePicCID || "/avatar.jpg"}
          alt="Profile"
          width={80}
          height={80}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-foreground font-bold text-3xl">{profileData.username} {isMyProfile && "(You)"}</h1>
          <p className="text-gray-400">{profileData.bio}</p>
          <p className="text-sm text-mutedText">Joined {dayjs(profileData.createdAt).format("MMMM DD, YYYY")}</p>
          {isMyProfile && (
            <button className="mt-3 px-4 py-2 bg-secondary hover:bg-accent/80 transition-all duration-300 text-white rounded-lg text-sm">
              Edit Profile
            </button>
          )}
        </div>
      </div>
          <h1 className="text-foreground text-lg pb-3">Videos</h1>
      {videos.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => <VideoGridItem key={video.id} {...video} />)}
        </div>
      ) : (
        <NoVideosScreen/>
      )}

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tips Received:</h3>
        {tips.length > 0 ? (
          <>
            <p className="text-sm font-semibold text-primary mb-3">
              Total Tips: {totalTipsReceived} ETH
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-secondary p-4 rounded-xl shadow-md">
                  <p className="text-primary font-semibold">{tip.username}</p>
                  <p className="text-sm text-gray-300">{tip.message}</p>
                  <p className="text-sm font-medium text-green-400 mt-1">{(Number(tip.amount) / 1e18).toFixed(4)} ETH</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <NoTipsScreen/>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
