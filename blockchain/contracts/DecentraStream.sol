// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DecentraStream {
    struct Video {
        uint256 id;
        string title;
        string description;
        string originalVideoCID;
        string[] videoCIDs;
        string thumbnailCID;
        string category;
        string[] tags;
        address owner;
        uint256 timestamp;
    }

    uint256 public videoCount;
    mapping(uint256 => Video) public videos;
    mapping(address => uint256[]) public userVideos;

    event VideoUploaded(
        uint256 indexed id,
        string title,
        string description,
        string originalVideoCID,
        string[] videoCIDs,
        string thumbnailCID,
        string category,
        string[] tags,
        address indexed owner,
        uint256 timestamp
    );

    modifier onlyOwner(uint256 _id) {
        require(videos[_id].owner == msg.sender, "Only owner can perform this action");
        _;
    }

    // Upload video with original CID and multiple versions
    function uploadVideo(
        string memory _title,
        string memory _description,
        string memory _originalVideoCID, // Original video CID
        string[] memory _videoCIDs,      // Multiple versions of the video
        string memory _thumbnailCID,
        string memory _category,
        string[] memory _tags
    ) public {
        videoCount++; // Increment ID first
        videos[videoCount] = Video(
            videoCount,
            _title,
            _description,
            _originalVideoCID,
            _videoCIDs,
            _thumbnailCID,
            _category,
            _tags,
            msg.sender,
            block.timestamp
        );
        userVideos[msg.sender].push(videoCount);

        emit VideoUploaded(
            videoCount,
            _title,
            _description,
            _originalVideoCID,
            _videoCIDs,
            _thumbnailCID,
            _category,
            _tags,
            msg.sender,
            block.timestamp
        );
    }

    function getUserVideos(address _user) public view returns (uint256[] memory) {
        return userVideos[_user];
    }

    function getVideo(uint256 _id) public view returns (Video memory) {
        require(_id > 0 && _id <= videoCount, "Invalid video ID");
        return videos[_id];
    }

    function getAllVideos() public view returns (Video[] memory) {
        Video[] memory allVideos = new Video[](videoCount);
        for (uint256 i = 0; i < videoCount; i++) {
            allVideos[i] = videos[i + 1]; // Start from 1-based index
        }
        return allVideos;
    }
}
