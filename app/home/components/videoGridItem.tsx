import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
  // duration,
  channel,
  thumbnailurl,
  // postedAt,
  views,
}: VideoGridItemProps) {
  return (
    <Link href={`/home/watch/${id}`} passHref>
      <motion.div
        className="xl:w-72 xl:h-40 md:w-80 md:h-56 bg-gray-800 rounded-md cursor-pointer overflow-hidden"
        whileHover={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label={`Watch ${title}`}
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
    </Link>
  );
}
