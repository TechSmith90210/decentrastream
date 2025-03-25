import Image from "next/image";
import { useRouter } from "next/navigation";

const NoVideosScreen = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-background text-foreground">
      {/* SVG Illustration */}
      <Image
        src="/no_videos_uploaded.svg" // Place your Undraw SVG in the public folder
        alt="No Videos Yet"
        width={150}
        height={150}
      />

      {/* Message */}
      <p className="mt-4 text-xs font-semibold text-mutedText font-body">
        No videos uploaded yet. Start by adding your first video!
      </p>

      {/* Upload Button */}
      <button
        onClick={() => router.replace("/upload")}
        className="mt-6 px-4 py-2 text-sm font-medium font-heading text-foreground bg-accent rounded-lg hover:bg-accent/70"
      >
        Upload Video
      </button>
    </div>
  );
};

export default NoVideosScreen;
