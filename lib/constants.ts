export const videoContractAddress =
  process.env.NEXT_PUBLIC_VIDEO_CONTRACT_ADDRESS || "";
export const profileContractAddress =
  process.env.NEXT_PUBLIC_PROFILE_CONTRACT_ADDRESS || "";
export const commentContractAddress =
  process.env.NEXT_PUBLIC_COMMENT_CONTRACT_ADDRESS || "";

export const videoContractAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "videoCID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "thumbnailCID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "tags",
        type: "string[]",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "VideoUploaded",
    type: "event",
  },
  {
    inputs: [],
    name: "getAllVideos",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "videoCID", type: "string" },
          { internalType: "string", name: "thumbnailCID", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string[]", name: "tags", type: "string[]" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct DecentraStream.Video[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserVideos",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_videoCID", type: "string" },
      { internalType: "string", name: "_thumbnailCID", type: "string" },
      { internalType: "string", name: "_category", type: "string" },
      { internalType: "string[]", name: "_tags", type: "string[]" },
    ],
    name: "uploadVideo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const profileContractAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProfileCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "string", name: "bio", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "profilePicCID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProfileUpdated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_username", type: "string" },
      { internalType: "string", name: "_bio", type: "string" },
      { internalType: "string", name: "_profilePicCID", type: "string" },
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_username", type: "string" }],
    name: "getAddressByUsername",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getProfile",
    outputs: [
      {
        components: [
          { internalType: "string", name: "username", type: "string" },
          { internalType: "string", name: "bio", type: "string" },
          { internalType: "string", name: "profilePicCID", type: "string" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct DecentraProfile.Profile",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "hasProfile",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_bio", type: "string" },
      { internalType: "string", name: "_profilePicCID", type: "string" },
    ],
    name: "updateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const commentContractAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: true,
        internalType: "uint256",
        name: "videoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "commentCID",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "author",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "profilePicCID",
        type: "string",
      },
    ],
    name: "CommentAdded",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_videoId", type: "uint256" },
      { internalType: "string", name: "_commentCID", type: "string" },
      { internalType: "string", name: "_username", type: "string" },
      { internalType: "string", name: "_profilePicCID", type: "string" },
    ],
    name: "addComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "commentCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "comments",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "commentCID", type: "string" },
      { internalType: "address", name: "author", type: "address" },
      { internalType: "uint256", name: "videoId", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "string", name: "username", type: "string" },
      { internalType: "string", name: "profilePicCID", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_videoId", type: "uint256" }],
    name: "getVideoComments",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "commentCID", type: "string" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "uint256", name: "videoId", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "username", type: "string" },
          { internalType: "string", name: "profilePicCID", type: "string" },
        ],
        internalType: "struct DecentraComments.Comment[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "videoComments",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
