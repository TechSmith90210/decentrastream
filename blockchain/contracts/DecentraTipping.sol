// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DecentraTipping {
    struct Tip {
        address sender;
        uint256 amount;
        string message;
        string username;
        string profilePicCID;
    }

    mapping(address => Tip[]) public tipsReceived;
    mapping(address => uint256) public totalTips;

    event TipReceived(
        address indexed uploader, 
        address indexed sender, 
        uint256 amount, 
        string message, 
        string username, 
        string profilePicCID
    );

    function tipUploader(
        address payable _uploader, 
        string memory _message, 
        string memory _username, 
        string memory _profilePicCID
    ) external payable {
        require(msg.value > 0, "Tip amount must be greater than 0");
        require(_uploader != address(0), "Invalid uploader address");

        tipsReceived[_uploader].push(Tip(msg.sender, msg.value, _message, _username, _profilePicCID));
        totalTips[_uploader] += msg.value;

        emit TipReceived(_uploader, msg.sender, msg.value, _message, _username, _profilePicCID);

        (bool success, ) = _uploader.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    function getTips(address _uploader) external view returns (Tip[] memory) {
        return tipsReceived[_uploader];
    }

    function getTipCount(address _uploader) external view returns (uint256) {
        return tipsReceived[_uploader].length;
    }
}
