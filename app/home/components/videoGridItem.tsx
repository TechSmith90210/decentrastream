import { motion } from "framer-motion";
import Image from "next/image";

type VideoGridItemProps = {
  id: string;
  title: string;
  duration: string;
  channel: {
    id: string;
    name: string;
    profileUrl: string;
  };
  videoUrl: string;
  thumbnailurl: string;
  postedAt: string;
  views: number;
  likes: number;
};

export function VideoGridItem({
  id,
  title,
  duration,
  channel,
  videoUrl,
  thumbnailurl,
  postedAt,
  views,
  likes,
}: VideoGridItemProps) {
  return (
    <motion.div
      className=" xl: {w-72 h-40} md: {w-80 h-56} bg-gray-800 rounded-md"
      whileHover={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Spring animation
    >
      <div className="relative w-full h-full">
        <Image
          src={thumbnailurl}
          alt={title}
          className="object-cover w-full h-full rounded-md"
          width={288}
          height={162}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 rounded-b-md">
          <h4 className="text-sm font-body text-foreground line-clamp-1">{title}</h4>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-body text-mutedText">{channel.name}</p>
            <p className="text-xs font-body text-mutedText">{views} views</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
