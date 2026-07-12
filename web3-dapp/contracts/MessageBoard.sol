// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessageBoard {
    struct Message { address author; string text; uint256 createdAt; }
    Message[] private messages;
    event MessagePosted(address indexed author, string text, uint256 createdAt);
    function post(string calldata text) external {
        require(bytes(text).length > 0 && bytes(text).length <= 280, "Message must be 1-280 bytes");
        messages.push(Message(msg.sender, text, block.timestamp));
        emit MessagePosted(msg.sender, text, block.timestamp);
    }
    function count() external view returns (uint256) { return messages.length; }
    function getMessage(uint256 index) external view returns (Message memory) { return messages[index]; }
}
