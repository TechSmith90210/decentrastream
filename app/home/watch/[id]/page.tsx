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
import { uploadTextToPinata } from "@/lib/pinata";
import { useParams } from "next/navigation";
import { CommentDataFromContract } from "@/lib/types";
import { toast } from "react-hot-toast";
import axios from "axios"; // Import axios for fetching data from IPFS
import { useRouter } from "next/navigation";
import { HeartHandshake } from "lucide-react";
import LoadingScreen from "@/app/components/loadingScreen";
// Function to generate correct IPFS gateway URL
const getIPFSUrl = (cid: string) =>
  cid ? `https://ipfs.io/ipfs/${cid.replace("ipfs://", "")}` : undefined;

const WatchVideo: React.FC = () => {
  interface VideoData {
    id: string;
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
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  });
  const [myProfileData, setMyProfileData] = useState<ProfileData>({
    username: "",
    profilePicCID: null,
  }); // Add myProfileData state
  const [comments, setComments] = useState<CommentDataFromContract[]>([]);
  const [newComment, setNewComment] = useState<string>(""); // Store user input
  const { address } = useAccount();
  const router = useRouter();

  const [commentsWithUsernames, setCommentsWithUsernames] = useState<
    {
      comment: CommentDataFromContract;
      username: string;
      content: string;
      profilePicCID: string;
    }[]
  >([]);

  const searchParams = useSearchParams();
  const { id } = useParams();

  // Fetch comments from smart contract
  const { data: fetchedComments = [] } = useReadContract({
    address: commentContractAddress as `0x${string}`,
    abi: commentContractAbi,
    functionName: "getVideoComments",
    args: [id], // Pass the video ID
  }) as { data?: CommentDataFromContract[] };

  const memoizedId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  useEffect(() => {
    if (searchParams) {
      const videoUrl = searchParams.get("videoUrl");
      const title = searchParams.get("title");
      const description = searchParams.get("description");
      const thumbnailurl = searchParams.get("thumbnailurl");
      const owner = searchParams.get("owner");

      if (
        videoUrl &&
        title &&
        description &&
        thumbnailurl &&
        owner &&
        memoizedId
      ) {
        const decodedVideoData = {
          videoUrl: decodeURIComponent(videoUrl),
          title: decodeURIComponent(title),
          description: decodeURIComponent(description),
          thumbnailUrl: decodeURIComponent(thumbnailurl),
          owner: decodeURIComponent(owner),
          id: decodeURIComponent(memoizedId),
        };

        console.log("Fetched Video Data:", decodedVideoData);

        setVideoData(decodedVideoData);
      }
      setLoading(false);
    }
  }, [searchParams, memoizedId]);

  // Fetch owner profile using `useReadContract`
  const { data: profile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [videoData?.owner],
  });

  useEffect(() => {
    if (profile) {
      console.log("Fetched profile data:", profile);
      const { username, profilePicCID } = profile as ProfileData;
      setProfileData({
        username,
        profilePicCID: profilePicCID ? getIPFSUrl(profilePicCID) ?? null : null,
      });
    }
  }, [profile]);

  // Fetch my profile data using `useReadContract`
  const { data: myProfile } = useReadContract({
    address: profileContractAddress as `0x${string}`,
    abi: profileContractAbi,
    functionName: "getProfile",
    args: [address], // Fetch profile data for the logged-in user
  });

  useEffect(() => {
    if (myProfile) {
      console.log("Fetched my profile data:", myProfile);
      const { username, profilePicCID } = myProfile as ProfileData;
      setMyProfileData({
        username,
        profilePicCID: profilePicCID ? getIPFSUrl(profilePicCID) ?? null : null,
      });
    }
  }, [myProfile]);

  // Wagmi hook to call the smart contract function
  const { writeContractAsync } = useWriteContract();

  // Function to add a comment
  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment text cannot be empty");
      return;
    }

    if (!videoData?.id) {
      toast.error("Video ID is missing.");
      return;
    }

    try {
      const ipfsHash = await uploadTextToPinata(
        JSON.stringify({ text: newComment })
      );
      if (!ipfsHash) {
        toast.error("Failed to upload comment to IPFS.");
        return;
      }

      // Use myProfileData for the username and profilePicCID
      const username = myProfileData.username || "Anonymous";
      const profilePicCID = myProfileData.profilePicCID || "";

      // Call the updated addComment function with username and profilePicCID
      await writeContractAsync({
        address: commentContractAddress as `0x${string}`,
        abi: commentContractAbi,
        functionName: "addComment",
        args: [videoData.id, ipfsHash, username, profilePicCID], // Include username and profilePicCID
      });

      toast.success("Comment added successfully!");
      setNewComment("");

      const newCommentData: CommentDataFromContract = {
        id: comments.length + 1,
        author: address || "You",
        commentCID: ipfsHash,
        videoId: Number(id),
        timestamp: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        username: username, // Include username
        profilePicCID: profilePicCID, // Include profilePicCID
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  const commentsWithText = useMemo(() => {
    return fetchedComments.map((comment) => {
      const ipfsUrl = getIPFSUrl(comment.commentCID);
      if (!ipfsUrl) return { ...comment, text: "Invalid CID" };

      return axios
        .get(ipfsUrl)
        .then((response) => ({ ...comment, text: response.data.text || "" }))
        .catch(() => ({ ...comment, text: "Failed to load comment" }));
    });
  }, [fetchedComments]);

  useEffect(() => {
    Promise.all(commentsWithText).then(setComments);
  }, [commentsWithText]);

  useEffect(() => {
    const fetchCommentContent = async () => {
      try {
        if (!comments || comments.length === 0) return;

        const commentsWithContent = await Promise.all(
          comments.map(async (comment) => {
            if (!comment || !comment.commentCID) return null; // Ensure commentCID is valid

            const ipfsUrl = getIPFSUrl(comment.commentCID);
            if (!ipfsUrl) return null;

            try {
              const response = await fetch(ipfsUrl);
              const data = await response.json(); // Parse the JSON response

              // Ensure content is properly parsed if it's a stringified JSON
              let commentText = data.text || "";

              // If `commentText` is still a stringified JSON, parse again
              if (
                typeof commentText === "string" &&
                commentText.startsWith("{")
              ) {
                try {
                  const parsedContent = JSON.parse(commentText);
                  commentText = parsedContent.text || "";
                } catch (error) {
                  console.error("Error parsing nested JSON:", error);
                }
              }

              return {
                comment: {
                  ...comment,
                  id: Number(comment.id), // Convert to number
                  videoId: Number(comment.videoId),
                  timestamp: Number(comment.timestamp),
                },
                username: comment.username || "Anonymous", // Use the username from the comment
                content: commentText, // Now correctly extracting "Hello"
                profilePicCID: comment.profilePicCID || "", // Use the profilePicCID from the comment
              };
            } catch (err) {
              console.error("Error fetching comment from IPFS:", err);
              return null;
            }
          })
        );

        // Filter out null values and update state
        setCommentsWithUsernames(
          commentsWithContent.filter((comment) => comment !== null) as {
            comment: CommentDataFromContract;
            username: string;
            content: string;
            profilePicCID: string;
          }[]
        );

        console.log("this is real data :- ", commentsWithContent);
      } catch (error) {
        console.error("Error fetching comments content from IPFS:", error);
      }
    };

    if (comments.length > 0) {
      fetchCommentContent();
    }
  }, [comments]);

  useEffect(() => {
    console.log("Fetched Comments from contract:", fetchedComments);
    if (fetchedComments) {
      setComments(fetchedComments);
    }
  }, [fetchedComments]);

  if (loading) {
    return <LoadingScreen/>;
  }

  if (!videoData) {
    return <p className="text-red-500">Error: Video data is missing.</p>;
  }

  const convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground p-4">
      {/* Left Section - Video & Details */}
      <div className="w-full md:w-[70%] flex flex-col space-y-2 md:pr-4">
        {/* Video Player */}
        <div className="w-full aspect-video rounded-lg shadow-lg bg-black">
          <video controls autoPlay className="w-full h-full rounded-lg">
            {videoData.videoUrl && (
              <source src={videoData.videoUrl} type="video/mp4" />
            )}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Title & Description */}
        <h1 className="text-2xl font-bold">
          {videoData.title || "Untitled Video"}
        </h1>
        <p className="text-sm text-mutedText">
          {videoData.description || "No description available"}
        </p>

        {/* Owner Section */}
        <div className="flex items-center justify-between pt-3 pb-5">
          <Link
            href={`/profile/${profileData.username}`}
            className="flex items-center gap-4 cursor-pointer group" // Added `group` for parent hover
          >
            {/* Profile Picture */}
            <div className="w-8 h-8 rounded-full overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-110">
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

            {/* Username and View Profile */}
            <div className="flex flex-col space-y-1">
              <h6 className="text-sm font-medium transition-colors duration-300 ease-in-out group-hover:text-accent">
                @{profileData.username || videoData.owner}
              </h6>
              <p className="text-xs text-mutedText font-body transition-colors duration-300 ease-in-out group-hover:text-accent">
                View Profile
              </p>
            </div>
          </Link>

          {/* Tip Button */}
          <button
            onClick={() => {
              console.log("Tip sent to:", profileData.username || videoData.owner);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-lg rounded-lg hover:bg-accent/90 transition-colors hover:shadow-md active:scale-95"
          >
            <HeartHandshake color="#E0E0E0" />
            <h6 className="text-foreground text-sm font-heading">Give Support</h6>
          </button>
        </div>
      </div>

      {/* Right Section - Comments */}
      <div className="w-full md:w-[30%] bg-secondary p-4 rounded-lg flex flex-col max-h-[70vh] md:max-h-[80vh]">
        {/* Comments Header */}
        <h2 className="text-lg font-heading font-medium mb-4 text-foreground">
          Comments
        </h2>

        {/* Comments List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-2">
          {commentsWithUsernames.length > 0 ? (
            commentsWithUsernames.map(
              ({ comment, username, content, profilePicCID }) => (
                <div
                  key={comment.id}
                  className="mb-4 p-4 bg-background rounded-lg shadow-sm"
                >
                  {/* Clickable Profile Section */}
                  <div
                    onClick={() => router.replace(`/profile/${username}`)}
                    className="flex items-center gap-2 group cursor-pointer" // Added `group` for parent hover
                  >
                    {/* Profile Picture */}
                    <div className="transition-transform duration-200 ease-in-out group-hover:scale-105">
                      {profilePicCID ? (
                        <Image
                          src={profilePicCID || ""}
                          alt="Profile"
                          width={30}
                          height={30}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <WalletAvatar address={comment.author} size={30} />
                      )}
                    </div>

                    {/* Username */}
                    <span className="text-sm font-heading text-foreground transition-colors duration-200 ease-in-out group-hover:text-foreground/70">
                      @{username}
                    </span>
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm font-body text-foreground mt-1">
                    {content || "Loading comment..."}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs font-body text-mutedText mt-1">
                    ({convertTimestamp(comment.timestamp)})
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-mutedText font-body">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Add Comment Input (Fixed at the Bottom) */}
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="text-sm font-body w-full p-2 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            rows={2}
          />
          <button
            onClick={addComment}
            className="mt-2 text-sm font-heading bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors w-full"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
