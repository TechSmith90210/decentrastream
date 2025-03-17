import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { VideoGridItemProps } from "@/lib/types";

export function VideoGridItem({
  id = "unknown-id", // Fallback ID
  title = "Untitled Video", // Fallback title
  thumbnailurl,
  description,
  videoUrl,
  owner,
}: VideoGridItemProps) {
  const safeThumbnailUrl = thumbnailurl || "/placeholder.jpg"; // Fallback thumbnail

  // Create a URL-encoded query string with all the video details
  const videoLink = `/home/watch/${encodeURIComponent(id)}?videoUrl=${encodeURIComponent(videoUrl || "")}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}&thumbnailurl=${encodeURIComponent(safeThumbnailUrl)}&owner=${encodeURIComponent(owner || "")}`;

  return (
    <Link href={videoLink} passHref>
      <motion.div
        className="xl:w-72 xl:h-40 md:w-80 md:h-56 bg-gray-800 rounded-md cursor-pointer overflow-hidden"
        whileHover={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label={`Watch ${title}`}
      >
        <div className="relative w-full h-full">
          <Image
            src={safeThumbnailUrl}
            alt={title}
            className="object-cover w-full h-full rounded-md"
            width={288}
            height={162}
            priority // Ensures fast loading
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 rounded-b-md">
            <h4 className="text-sm font-body text-foreground line-clamp-1">{title}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs font-body text-mutedText line-clamp-1">{description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
