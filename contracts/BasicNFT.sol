// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

error BasicNFT__NotOwner();

contract BasicNFT {
    address private immutable i_owner;

    modifier onlyOwner() {
        if (msg.sender != i_owner) { revert BasicNFT__NotOwner(); }
        _;
    }

    constructor() {
        i_owner = msg.sender;
    }
    
    function getOwner() public view returns (address) {
      return i_owner;
    }
}
