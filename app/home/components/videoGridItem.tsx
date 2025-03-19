import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { VideoGridItemProps } from "@/lib/types";
import WalletAvatar from "./walletavatar";

dayjs.extend(relativeTime); // Enable "from now" functionality

export function VideoGridItem({
  id = "unknown-id",
  title = "Untitled Video",
  thumbnailurl,
  description,
  videoUrl,
  owner,
  // postedAt,
}: VideoGridItemProps) {
  const safeThumbnailUrl = thumbnailurl || "/placeholder.jpg"; // Fallback thumbnail

  // // Convert postedAt to a number and format timestamp
  // const formattedTime =
  //   postedAt && !isNaN(Number(postedAt))
  //     ? dayjs(Number(postedAt) * 1000).fromNow()
  //     : "Unknown time";

  // Create a URL-encoded query string
  const videoLink = `/home/watch/${encodeURIComponent(id)}?videoUrl=${encodeURIComponent(videoUrl || "")}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}&thumbnailurl=${encodeURIComponent(safeThumbnailUrl)}&owner=${encodeURIComponent(owner || "")}`;

  return (
    <Link href={videoLink} passHref>
      <motion.div
        className="xl:w-72 md:w-80 bg-background rounded-md cursor-pointer overflow-hidden flex flex-col gap-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Thumbnail with fixed 16:9 aspect ratio */}
        <div className=" relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={safeThumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            width={400}
            height={200} // 16:9 ratio (YouTube-like)
            priority
          />
        </div>

        {/* Video Details */}
        <div className="flex gap-2 items-center">
          <Link href={`/profile/${''}`} className="flex shrink-0 ">
            <WalletAvatar address={owner} size={30} />
          </Link>
          <div>
          <Link href={``}>
            <h1 className="text-sm text-foreground font-heading font-medium">{title}</h1>
          </Link>
          <h6 className="text-xs text-mutedText font-light line-clamp-1">{description}</h6>
          </div>
        </div>

      </motion.div>
    </Link>
  );
}
