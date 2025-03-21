// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DecentraComments {
    struct Comment {
        uint256 id;
        string commentCID;
        address author;
        uint256 videoId;
        uint256 timestamp;
        string username; 
        string profilePicCID;
    }

    uint256 public commentCount;
    mapping(uint256 => Comment) public comments;
    mapping(uint256 => uint256[]) public videoComments; // videoId => commentIds

    event CommentAdded(
        uint256 indexed id,
        uint256 indexed videoId,
        string commentCID,
        address indexed author,
        uint256 timestamp,
        string username,
        string profilePicCID 
    );

    // Updated function to include username and profilePicCID
    function addComment(
        uint256 _videoId,
        string memory _commentCID,
        string memory _username,
        string memory _profilePicCID
    ) public {
        commentCount++;
        comments[commentCount] = Comment(
            commentCount,
            _commentCID,
            msg.sender,
            _videoId,
            block.timestamp,
            _username, // Include username in the Comment struct
            _profilePicCID // Include profilePicCID in the Comment struct
        );

        videoComments[_videoId].push(commentCount);

        emit CommentAdded(
            commentCount,
            _videoId,
            _commentCID,
            msg.sender,
            block.timestamp,
            _username,
            _profilePicCID
        );
    }

    function getVideoComments(uint256 _videoId) public view returns (Comment[] memory) {
        uint256[] storage commentIds = videoComments[_videoId];
        Comment[] memory result = new Comment[](commentIds.length);

        for (uint256 i = 0; i < commentIds.length; i++) {
            result[i] = comments[commentIds[i]];
        }
        return result;
    }
}