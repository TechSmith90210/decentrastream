"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import WalletAvatar from "../../components/walletavatar";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  profileContractAddress,
  profileContractAbi,
  commentContractAddress,
  commentContractAbi,
} from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { fetchFilenameFromPinata, uploadTextToPinata } from "@/lib/pinata";
import { useParams } from "next/navigation";
import { CommentDataFromContract } from "@/lib/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/app/components/loadingScreen";
import TipButton from "../../components/tipButton";

// Improved IPFS URL handling with fallback gateways
const getIPFSUrl = (cid: string) => {
  if (!cid) return undefined;
  const cleanCID = cid.replace("ipfs://", "");
  const gateways = [
    `https://ipfs.io/ipfs/${cleanCID}`,
    `https://gateway.pinata.cloud/ipfs/${cleanCID}`,
    `https://cloudflare-ipfs.com/ipfs/${cleanCID}`,
  ];
  return gateways[0]; // Can implement fallback logic if needed
};

interface ProfileData {
  username: string;
  profilePicCID: string | null;
}

const extractCID = (url: string) => {
  if (!url) return "";

  const decodedUrl = decodeURIComponent(url);
  console.log("Extracting CID from:", decodedUrl); // Debugging log

  const cidMatch = decodedUrl.match(/ipfs\/([a-zA-Z0-9]+)/);
  return cidMatch ? cidMatch[1] : url;
};

interface VideoData {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  owner: string;
  cids: string[];
  resolutions: { label: string; cid: string }[];
}

const WatchVideo: React.FC = () => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [selectedResolution, setSelectedResolution] = useState(
    videoData?.resolutions[0]?.cid || ""
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  });
  const [myProfileData, setMyProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  });
  const [comments, setComments] = useState<CommentDataFromContract[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { address } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const [commentsWithUsernames, setCommentsWithUsernames] = useState<
    {
      comment: CommentDataFromContract;
      username: string;
      content: string;
      profilePicCID: string;
    }[]
  >([]);

  // Memoize the ID to prevent unnecessary re-renders
  const memoizedId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  // Fetch comments from contract
  const { data: fetchedComments = [] } = useReadContract({
    address: commentContractAddress as `0x${string}`,
    abi: commentContractAbi,
    functionName: "getVideoComments",
    args: [memoizedId],
  }) as { data?: CommentDataFromContract[] };

  // Fetch video data from URL params
  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams) return;

      try {
        const videoUrl = searchParams.get("videoUrl");
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const thumbnailurl = searchParams.get("thumbnailurl");
        const owner = searchParams.get("owner");
        const cidsParam = searchParams.get("cids");

        if (
          !videoUrl ||
          !title ||
          !description ||
          !thumbnailurl ||
          !owner ||
          !memoizedId
        ) {
          throw new Error("Missing required video parameters");
        }

        const cids = cidsParam ? JSON.parse(decodeURIComponent(cidsParam)) : [];
        console.log(
          cids.length > 0 ? "Video sources found" : "No video sources found"
        );
        const videoSources = cids.length > 0 ? cids : [videoUrl];
        const resolutions = ["original", ...cids];

        // Create filename map for resolutions
        const filenameMap = await Promise.all(
          cids.map(async (cid: string) => {
            const filename = await fetchFilenameFromPinata(cid);
            return { cid, filename };
          })
        ).then((results) =>
          results.reduce((acc, { cid, filename }) => {
            if (filename) acc[cid] = filename;
            return acc;
          }, {} as Record<string, string>)
        );

        const extractResolutionFromFilename = (filename: string) => {
          // Match patterns like "_360p", "360p_", "360p.mp4", etc.
          const resolutionMatch = filename.match(/(\d{3,4}p)/i);
          return resolutionMatch ? resolutionMatch[0] : filename;
        };
        interface VideoResolution {
          label: string;
          cid: string;
        }
        
        const mappedResolutions: VideoResolution[] = cids.map((resolution: string) => ({
          label: extractResolutionFromFilename(filenameMap[resolution] || resolution),
          cid: extractCID(resolution),
        }));

        setVideoData({
          videoUrl: decodeURIComponent(videoUrl),
          title: decodeURIComponent(title),
          description: decodeURIComponent(description),
          thumbnailUrl: decodeURIComponent(thumbnailurl),
          owner: decodeURIComponent(owner),
          id: decodeURIComponent(memoizedId),
          cids: videoSources,
          resolutions: mappedResolutions,
        });
        console.log(videoSources, mappedResolutions); // Debugging log
        setSelectedResolution(resolutions[0]);
      } catch (error) {
        console.error("Error fetching video data:", error);
        toast.error("Failed to load video data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, memoizedId]);

  // Fetch owner profile
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [videoData?.owner],
  });

  useEffect(() => {
    if (profile) {
      const { username, profilePicCID } = profile as ProfileData;
      setProfileData({
        username,
        profilePicCID: profilePicCID ? getIPFSUrl(profilePicCID) ?? null : null,
      });
    }
  }, [profile]);

  // Fetch current user profile
  const { data: myProfile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [address],
  });

  useEffect(() => {
    if (myProfile) {
      const { username, profilePicCID } = myProfile as ProfileData;
      setMyProfileData({
        username,
        profilePicCID: profilePicCID ? getIPFSUrl(profilePicCID) ?? null : null,
      });
    }
  }, [myProfile]);

  // Process comments with text content
  useEffect(() => {
    const processComments = async () => {
      if (!fetchedComments || fetchedComments.length === 0) return;

      try {
        const processedComments = await Promise.all(
          fetchedComments.map(async (comment) => {
            try {
              const ipfsUrl = getIPFSUrl(comment.commentCID);
              if (!ipfsUrl) return null;

              const response = await axios.get(ipfsUrl);
              let content = response.data?.text || "";

              // Handle nested JSON content
              if (typeof content === "string" && content.startsWith("{")) {
                try {
                  const parsed = JSON.parse(content);
                  content = parsed.text || "";
                } catch (e) {
                  console.error("Error parsing nested comment JSON:", e);
                }
              }

              return {
                comment: {
                  ...comment,
                  id: Number(comment.id),
                  videoId: Number(comment.videoId),
                  timestamp: Number(comment.timestamp),
                },
                username: comment.username || "Anonymous",
                content,
                profilePicCID: comment.profilePicCID || "",
              };
            } catch (error) {
              console.error("Error processing comment:", error);
              return null;
            }
          })
        );

        setCommentsWithUsernames(
          processedComments.filter(Boolean) as {
            comment: CommentDataFromContract;
            username: string;
            content: string;
            profilePicCID: string;
          }[]
        );
      } catch (error) {
        console.error("Error processing comments:", error);
      }
    };

    processComments();
  }, [fetchedComments]);

  // Add comment function
  const { writeContractAsync } = useWriteContract();
  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment text cannot be empty", {
        style: {
          borderRadius: "10px",
          background: "#1b1b1b",
          color: "#fff",
        },
      });
      return;
    }

    if (!videoData?.id || !address) {
      toast.error("Missing required data");
      return;
    }

    try {
      const ipfsHash = await uploadTextToPinata(
        JSON.stringify({ text: newComment })
      );
      if (!ipfsHash) {
        throw new Error("IPFS upload failed");
      }

      await writeContractAsync({
        address: commentContractAddress as `0x${string}`,
        abi: commentContractAbi,
        functionName: "addComment",
        args: [
          videoData.id,
          ipfsHash,
          myProfileData.username || "Anonymous",
          myProfileData.profilePicCID || "",
        ],
      });

      toast.success("Comment added successfully!");
      setNewComment("");

      // Optimistically update comments
      const newCommentData: CommentDataFromContract = {
        id: comments.length + 1,
        author: address,
        commentCID: ipfsHash,
        videoId: Number(memoizedId),
        timestamp: Math.floor(Date.now() / 1000),
        username: myProfileData.username || "Anonymous",
        profilePicCID: myProfileData.profilePicCID || "",
      };

      setComments((prev) => [...prev, newCommentData]);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const convertTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!videoData) {
    return <p className="text-red-500">Error: Video data is missing.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground p-2 sm:p-4">
      {/* Left Section - Video & Details */}
      <div className="w-full lg:w-[70%] flex flex-col space-y-2 lg:pr-4">
        {/* Video Player */}
        <div className="w-full aspect-video rounded-lg shadow-lg bg-black relative">
          <video
            key={selectedResolution}
            src={getIPFSUrl(
              selectedResolution === "original"
                ? extractCID(videoData?.videoUrl || "")
                : selectedResolution
            )}
            controls
            className="w-full h-full rounded-lg object-contain"
            autoPlay
          />
        </div>

        {/* Resolution Chips - Moved below video player */}
        {videoData.resolutions.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end mt-2">
            {videoData.resolutions.map(({ label, cid }) => (
              <button
                key={cid}
                onClick={() => setSelectedResolution(cid)}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm border ${
                  selectedResolution === cid
                    ? "bg-accent text-white border-accent"
                    : "bg-background text-foreground border-border hover:bg-secondary"
                } transition-colors`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Video Title & Description */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold line-clamp-2">
            {videoData.title || "Untitled Video"}
          </h1>
          <p className="text-xs sm:text-sm text-mutedText line-clamp-3">
            {videoData.description || "No description available"}
          </p>
        </div>

        {/* Owner Section */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 pb-3 sm:pb-5">
          <Link
            href={`/profile/${profileData.username}`}
            className="flex items-center gap-2 sm:gap-4 cursor-pointer group flex-1 min-w-0"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110 shrink-0">
              {profileData.profilePicCID ? (
                <Image
                  src={profileData.profilePicCID}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                  quality={100}
                  priority
                />
              ) : (
                <WalletAvatar address={videoData.owner} size={30} />
              )}
            </div>

            <div className="flex flex-col space-y-0 sm:space-y-1 min-w-0">
              <h6 className="text-xs sm:text-sm font-medium transition-colors duration-300 ease-in-out group-hover:text-accent truncate">
                @{profileData.username || videoData.owner}
              </h6>
              <p className="text-[10px] sm:text-xs text-mutedText font-body transition-colors duration-300 ease-in-out group-hover:text-accent">
                View Profile
              </p>
            </div>
          </Link>

          <div className="ml-2 sm:ml-4">
            <TipButton
              uploader={videoData.owner as `0x${string}`}
              uploaderName={profileData.username ?? "Unknown"}
              uploaderPicCID={profileData.profilePicCID ?? ""}
              username={myProfileData.username}
              userProfilePicCID={myProfileData.profilePicCID ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Comments */}
      <div className="w-full lg:w-[30%] bg-secondary p-2 sm:p-4 rounded-lg flex flex-col h-[40vh] sm:h-[50vh] lg:h-[80vh] mt-4 lg:mt-0">
        <h2 className="text-base sm:text-lg font-heading font-medium mb-2 sm:mb-4 text-foreground">
          Comments
        </h2>

        <div className="flex-1 overflow-y-auto px-1 sm:px-2">
          {commentsWithUsernames.length > 0 ? (
            commentsWithUsernames.map(
              ({ comment, username, content, profilePicCID }) => (
                <div
                  key={`${comment.id}-${comment.timestamp}`}
                  className="mb-3 sm:mb-4 p-2 sm:p-4 bg-background rounded-lg shadow-sm"
                >
                  <div
                    onClick={() => router.push(`/profile/${username}`)}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <div className="transition-transform duration-200 ease-in-out group-hover:scale-105">
                      {profilePicCID ? (
                        <Image
                          src={profilePicCID}
                          alt="Profile"
                          width={30}
                          height={30}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <WalletAvatar address={comment.author} size={24} />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-heading text-foreground transition-colors duration-200 ease-in-out group-hover:text-foreground/70 truncate">
                      @{username}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-body text-foreground mt-1 line-clamp-3">
                    {content}
                  </p>

                  <p className="text-[10px] sm:text-xs font-body text-mutedText mt-1">
                    {convertTimestamp(comment.timestamp)}
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-xs sm:text-sm text-mutedText font-body">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        <div className="mt-2 sm:mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="text-xs sm:text-sm font-body w-full p-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            rows={2}
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="mt-1 sm:mt-2 text-xs sm:text-sm font-heading bg-accent text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-accent/90 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
