"use client";

import React, { useState, useEffect } from "react";
import { Video, Send, FileImage, X, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useWriteContract, useTransaction } from "wagmi";
import { videoContractAddress, videoContractAbi } from "../../lib/constants";
import { Config } from "tailwindcss";
import { BackendResponse } from "@/lib/types";
import { toast } from "react-hot-toast";

const UploadPage: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<{ name: string; size: number; thumbnail: string | null }>({ name: "", size: 0, thumbnail: null });

  // TODO: Fix any type error in upload page.tsx
  const { writeContract } = useWriteContract() as { data: { hash: `0x${string}` } | undefined, writeContract: Config["writeContract"] };
  const { isLoading: isTxLoading, isSuccess } = useTransaction({
    hash: (txHash as `0x${string}`) ?? undefined,
  });



  useEffect(() => {
    if (isSuccess) {
      alert("Video uploaded successfully to blockchain!");
    }
  }, [isSuccess]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "video"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (type === "thumbnail") {
        setThumbnail(file);
      } else {
        setVideo(file);
        setVideoDetails({
          name: file.name,
          size: file.size,
          thumbnail: URL.createObjectURL(file),
        });
      }
    }
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim() !== "") {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Upload file to Pinata
  const uploadToPinata = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      formData.append(
        "pinataMetadata",
        JSON.stringify({ name: file.name })
      );

      formData.append(
        "pinataOptions",
        JSON.stringify({ cidVersion: 1 })
      );

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
      return `ipfs://${data.IpfsHash}`;
    } catch (error) {
      console.error("Pinata Upload Error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Check if all required fields are filled
    if (!title || !description || !category || !video || !thumbnail) {
      alert("Please fill in all fields and upload both video and thumbnail.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload the video to the backend API
      const backendFormData = new FormData();
      backendFormData.append('video', video);

      const backendUrl = `https://decentrabackend-production.up.railway.app/upload`;

      // Call backend API to upload the video
      const backendResponse = await fetch(backendUrl, {
        method: 'POST',
        body: backendFormData,
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || 'Failed to upload video to the backend');
      }

      const backendData: BackendResponse = await backendResponse.json(); // Use the defined type here
      console.log('Backend video upload successful:', backendData);

      // Step 2: Upload the thumbnail to IPFS
      const thumbnailCID = await uploadToPinata(thumbnail);
      console.log("Thumbnail uploaded to IPFS:", thumbnailCID);

      // Step 3: Extract CIDs dynamically from backend response
      const videoCIDs: string[] = Object.values(backendData.files).map((file) => file.videoCID);
      const originalVideoCID = videoCIDs[0];  // Assuming the first video is the "original" (360p)

      console.log("Video CIDs from backend:", videoCIDs);
      console.log("Original Video CID:", originalVideoCID);

      // Step 4: Call Smart Contract to store video info
      const txData = await writeContract({
        address: videoContractAddress as `0x${string}`,
        abi: videoContractAbi,
        functionName: "uploadVideo",
        args: [title, description, originalVideoCID, videoCIDs, thumbnailCID, category, tags],
      });

      // Step 5: If the transaction is successful, log the transaction hash
      if (txData?.hash) {
        console.log("Transaction Hash:", txData.hash);
        setTxHash(txData.hash);
      }

      toast.success("Video uploaded successfully!");

    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // Set loading state to false after completing all steps
      setLoading(false);
    }
  };


  return (
    <div className="p-6 min-h-[100dvh] flex flex-col gap-6 bg-secondary text-foreground w-full max-w-2xl mx-auto md:pb-0 pb-20">
      <h1 className="text-2xl font-semibold">Upload</h1>
      <div className="p-6 bg-secondary rounded-lg shadow-md w-full flex flex-col gap-6">
        <label className="text-sm font-medium">Video</label>
        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border rounded-lg bg-background hover:bg-accent transition p-4">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            className="hidden"
          />
          <Video className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">Click to upload</span>
        </label>
        {videoDetails.thumbnail && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <video
              src={videoDetails.thumbnail}
              controls
              className="w-full rounded-lg"
              style={{ height: "300px", objectFit: "contain" }} // Set the height and object-fit properties
            />
            <span className="text-sm text-gray-400">{videoDetails.name}</span>
            <span className="text-sm text-gray-400">
              {(videoDetails.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}

        <label className="text-sm font-medium">Thumbnail</label>
        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer border rounded-lg bg-background hover:bg-accent transition p-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumbnail")}
            className="hidden"
          />
          {thumbnail ? (
            <Image
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail Preview"
              width={320}
              height={160}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <FileImage className="w-6 h-6 text-gray-400" />
          )}
          <span className="text-xs text-gray-400">Click to upload</span>
        </label>

        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="Enter title"
          className="p-2 border rounded-lg bg-background text-foreground"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Enter description"
          className="p-2 border rounded-lg bg-background text-foreground"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="text-sm font-medium">Category</label>
        <select
          className="p-2 border rounded-lg bg-background text-foreground"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-background">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-accent text-foreground rounded-md cursor-pointer"
              onClick={() => removeTag(index)}
            >
              #{tag} <X className="w-4 h-4 text-gray-600" />
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tags and press Enter"
            className="p-1 text-sm bg-background text-foreground flex-1"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 flex items-center justify-center gap-2 px-4 py-3 text-foreground bg-accent hover:bg-accent/80 rounded-lg transition w-full"
          disabled={loading || isTxLoading}
        >
          {loading || isTxLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {loading || isTxLoading ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
