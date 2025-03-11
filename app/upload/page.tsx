"use client";
import React, { useState } from "react";
import { Video, Send, FileImage, X } from "lucide-react";
import Image from "next/image";

const UploadPage: React.FC = () => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "video"
  ) => {
    if (event.target.files && event.target.files[0]) {
      if (type === "thumbnail") setThumbnail(event.target.files[0]);
      else setVideo(event.target.files[0]);
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

  const handleSubmit = () => {
    console.log({ title, description, category, tags, thumbnail, video });
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
          className="p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Enter description"
          className="p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="text-sm font-medium">Category</label>
        <select
          className="p-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
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
            className="p-1 text-sm bg-background text-foreground flex-1 min-w-[120px] focus:outline-none"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 flex items-center justify-center gap-2 px-4 py-3 text-foreground bg-accent hover:bg-accent/80 rounded-lg transition w-full"
        >
          <Send className="w-5 h-5" /> Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
