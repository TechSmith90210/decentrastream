"use client"; // ✅ Add this at the top

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { VideoGridItem } from "./components/videoGridItem";


const HomePage: React.FC = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/"); // Redirect to landing page if not connected
    }
  }, [isConnected, router]);

  return (
    <div className="bg-background p-4 h-screen flex flex-col">
      <h1 className="text-foreground font-heading text-4xl">Home</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-4">
        <VideoGridItem
          id="1"
          title="BLESSED | Gaurav Kapoor | Stand Up Comedy"
          duration="27:00"
          channel={{
            id: "1",
            name: "Gaurav Kapoor",
            profileUrl: "/profile.png",
          }}
          videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          thumbnailurl="/placeholderVideos/videoImg1.jpg"
          postedAt="3 days ago"
          views={1000}
          likes={100}
        />
        <VideoGridItem
          id="2"
          title="How to solve a Google coding interview question"
          duration="5:00"
          channel={{
            id: "2",
            name: "Life at Google",
            profileUrl: "/profile.png",
          }}
          videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          thumbnailurl="/placeholderVideos/videoImg2.jpg"
          postedAt="2 days ago"
          views={2000}
          likes={200}
        />
        <VideoGridItem
          id="3"
          title = "Why Is MIT Making Robot Insects?"
          duration="15:00"
          channel={{
            id: "3",
            name: "Veritasium",
            profileUrl: "/profile.png",
          }}
          videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          thumbnailurl="/placeholderVideos/videoImg3.jpg"
          postedAt="3 days ago"
          views={3000}
          likes={300}
        />

        <VideoGridItem
          id="4"
          title="Man Builds DIY ANTI-RAIN Motorcycle | Start to Finish by ‪@mwigmedia‬"
          duration="16:30"
          channel={{
            id: "1",
            name: "Quantum Tech HD",
            profileUrl: "/profile.png",
          }}
          videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          thumbnailurl="/placeholderVideos/videoImg4.jpg"
          postedAt="1 day ago"
          views={1000}
          likes={100}
        />
        
      </div>
    </div>
  );
};

export default HomePage;
