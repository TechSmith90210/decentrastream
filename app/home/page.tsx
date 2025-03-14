"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { VideoGridItem } from "./components/videoGridItem";

const videos = [
  {
    id: "1",
    title: "BLESSED | Gaurav Kapoor | Stand Up Comedy",
    duration: "27:00",
    channel: { id: "1", name: "Gaurav Kapoor", profileUrl: "/profile.png" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailurl: "/placeholderVideos/videoImg1.jpg",
    postedAt: "3 days ago",
    views: 1000,
    likes: 100,
  },
  {
    id: "2",
    title: "How to solve a Google coding interview question",
    duration: "5:00",
    channel: { id: "2", name: "Life at Google", profileUrl: "/profile.png" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailurl: "/placeholderVideos/videoImg2.jpg",
    postedAt: "2 days ago",
    views: 2000,
    likes: 200,
  },
  {
    id: "3",
    title: "Why Is MIT Making Robot Insects?",
    duration: "15:00",
    channel: { id: "3", name: "Veritasium", profileUrl: "/profile.png" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailurl: "/placeholderVideos/videoImg3.jpg",
    postedAt: "3 days ago",
    views: 3000,
    likes: 300,
  },
  {
    id: "4",
    title:
      "Man Builds DIY ANTI-RAIN Motorcycle | Start to Finish by ‪@mwigmedia‬",
    duration: "16:30",
    channel: { id: "1", name: "Quantum Tech HD", profileUrl: "/profile.png" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailurl: "/placeholderVideos/videoImg4.jpg",
    postedAt: "1 day ago",
    views: 1000,
    likes: 100,
  },
  {
    id: "5",
    title: "Quantum Computers, explained with MKBHD",
    duration: "17:00",
    channel: { id: "2", name: "Cleo Abram", profileUrl: "/profile.png" },
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailurl: "/placeholderVideos/videoImg5.jpg",
    postedAt: "1 year ago",
    views: 900000,
    likes: 20000,
  },
];

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/"); // Redirect to landing page if not connected
    }
  }, [isConnected, router]);

  return (
    <div className="bg-background p-8 min-h-[100dvh] flex flex-col">
      <h1 className="text-foreground font-heading text-3xl">Popular Videos</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2 gap-4">
        {videos.map((video) => (
          <VideoGridItem key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
