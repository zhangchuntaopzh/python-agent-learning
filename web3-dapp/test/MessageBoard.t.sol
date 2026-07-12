// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MessageBoard} from "../contracts/MessageBoard.sol";

contract MessageBoardTest {
    MessageBoard private board;
    function setUp() public { board = new MessageBoard(); }
    function testPostStoresMessage() public {
        board.post("Hello Sepolia");
        require(board.count() == 1, "count should be one");
        (, string memory text,) = board.getMessage(0);
        require(keccak256(bytes(text)) == keccak256(bytes("Hello Sepolia")), "text mismatch");
    }
    function testEmptyMessageReverts() public {
        (bool ok,) = address(board).call(abi.encodeWithSelector(board.post.selector, ""));
        require(!ok, "empty message must revert");
    }
}
