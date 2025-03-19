export interface VideoGridItemProps {
    id: string; // IPFS CID
    title: string;
    duration: string;
    description:string;
    videoUrl: string;
    thumbnailurl: string;
    postedAt: string;
    videoCID: string;
    owner:string;
  }
  
// Define the expected shape of data returned from the smart contract
export interface VideoDataFromContract {
    id: number; // Corresponds to the 'id' field in Solidity
    title: string; // Corresponds to the 'title' field in Solidity
    description: string; // Corresponds to the 'description' field in Solidity
    videoCID: string; // Corresponds to the 'videoCID' field in Solidity
    thumbnailCID: string; // Corresponds to the 'thumbnailCID' field in Solidity
    category: string; // Corresponds to the 'category' field in Solidity
    tags: string[]; // Corresponds to the 'tags' field in Solidity
    owner: `0x${string}`; // Corresponds to the 'owner' field in Solidity (address in hex format)
    timestamp: number; // Corresponds to the 'timestamp' field in Solidity (Unix timestamp)
  }