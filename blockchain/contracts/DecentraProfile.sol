// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DecentraProfile {
    struct Profile {
        string username;
        string bio;
        string profilePicCID;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => Profile) private profiles;
    mapping(string => address) private usernameToAddress;

    event ProfileCreated(address indexed user, string username, uint256 timestamp);
    event ProfileUpdated(address indexed user, string bio, string profilePicCID, uint256 timestamp);

    function createProfile(
        string memory _username,
        string memory _bio,
        string memory _profilePicCID
    ) public {
        require(msg.sender != address(0), "Invalid sender");
        require(bytes(profiles[msg.sender].username).length == 0, "Username already set");
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        require(bytes(_profilePicCID).length > 0, "Profile picture CID required");
        require(bytes(_bio).length <= 280, "Bio too long");

        profiles[msg.sender] = Profile({
            username: _username,
            bio: _bio,
            profilePicCID: _profilePicCID,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        usernameToAddress[_username] = msg.sender;

        emit ProfileCreated(msg.sender, _username, block.timestamp);
    }

    function updateProfile(string memory _bio, string memory _profilePicCID) public {
        require(bytes(profiles[msg.sender].username).length > 0, "Profile does not exist");

        if (bytes(_bio).length > 0) {
            profiles[msg.sender].bio = _bio;
        }

        if (bytes(_profilePicCID).length > 0) {
            profiles[msg.sender].profilePicCID = _profilePicCID;
        }

        profiles[msg.sender].updatedAt = block.timestamp;

        emit ProfileUpdated(msg.sender, profiles[msg.sender].bio, profiles[msg.sender].profilePicCID, block.timestamp);
    }

    function getProfile(address _user) public view returns (Profile memory) {
        require(bytes(profiles[_user].username).length > 0, "Profile does not exist");
        return profiles[_user];
    }

    function hasProfile(address _user) public view returns (bool) {
        return bytes(profiles[_user].username).length > 0;
    }

    function getAddressByUsername(string memory _username) public view returns (address) {
        require(usernameToAddress[_username] != address(0), "Username does not exist");
        return usernameToAddress[_username];
    }
}
