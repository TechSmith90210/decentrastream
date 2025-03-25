import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import TipModal from "./TipModal";

export default function TipButton({ 
  uploader, 
  uploaderName, 
  uploaderPicCID, 
  userProfilePicCID, 
  username 
}: { 
  uploader: `0x${string}`;
  uploaderName: string;
  uploaderPicCID: string;
  userProfilePicCID: string;
  username: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-lg rounded-lg hover:bg-accent/90 transition-colors hover:shadow-md active:scale-95"
      >
        <HeartHandshake color="#E0E0E0" />
        <h6 className="text-foreground text-sm font-heading">Give Support</h6>
      </button>

      {isOpen && (
        <TipModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          uploader={uploader} 
          uploaderName={uploaderName} 
          uploaderPicCID={uploaderPicCID} 
          userProfilePicCID={userProfilePicCID} 
          username={username} 
        />
      )}
    </>
  );
}
