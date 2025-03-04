"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WatchPage = () => {
  const params = useParams(); // ✅ Unwrap params properly
  const router = useRouter();
  const videoId = params?.id as string; // ✅ Ensure it's a string

  useEffect(() => {
    if (!videoId) {
      router.push("/home");
    }
  }, [videoId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-foreground">
      <h1 className="text-3xl font-bold">Watching Video: {videoId}</h1>
      {/* TODO: Embed video player here */}
    </div>
  );
};

export default WatchPage;
