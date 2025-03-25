export interface VideoGridItemProps {
  id: string;
  title: string;
  thumbnailurl?: string;
  description?: string;
  videoUrl?: string;
  owner: string;
  videoCids?: string[]; // Add this
  postedAt?: string | number;
}
// Define the expected shape of data returned from the smart contract
export interface VideoDataFromContract {
  id: number;
  title: string;
  description: string;
  originalVideoCID: string;
  videoCIDs: string[];
  thumbnailCID: string;
  category: string;
  tags: string[];
  owner: string;
  timestamp: number;
}

// Define the structure of a file object returned from the backend
export interface BackendFile {
  videoCID: string;
}

// Define the structure of the response from the backend
export interface BackendResponse {
  message: string;
  files: Record<string, BackendFile>;
}



export interface CommentDataFromContract {
  id: number;
  author: string;
  commentCID: string;
  videoId: number;
  timestamp: number;
  username: string;
  profilePicCID: string;
}

export interface TippingDataFromContract {
  sender: string; // Address of the tipper
  amount: string; // Amount sent in Wei (BigNumber format recommended)
  message: string; // Message from the tipper
  username: string; // Username of the tipper
  profilePicCID: string;
}
