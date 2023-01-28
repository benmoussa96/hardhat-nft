// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/**
 * @title RandomIpfsNft
 * @author Ghaieth BEN MOUSSA
 * @notice NFT hosted on IPFS that uses randomness to generate the asset
 * @dev When you mint an NFT, you trigger a Chainlink VFR call to get random number
 * Using that number, you will get a random NFT:
 * - Pug (Super rare)
 * - Shiba Inu (Kind of rare)
 * - St Bernard (Common)
 * Users have to pay to mint the NFT
 * Contract owner can withdraw ETH
 */
contract RandomIpfsNft {
}