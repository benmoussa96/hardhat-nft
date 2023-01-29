// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NotEnoughEthToPayFee();

/**
 * @title RandomIpfsNft
 * @author Ghaieth BEN MOUSSA
 * @notice NFT hosted on IPFS that uses randomness to generate the asset
 * @dev Minting your NFT triggers a Chainlink VFR call to get a random number
 * Using that number, you will get a random NFT:
 * - Pug (Super rare)
 * - Shiba Inu (Kind of rare)
 * - St Bernard (Common)
 * Users have to pay to mint the NFT
 * Contract owner can withdraw ETH
 */
contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage {
    // Types
    enum Breed {
        PUB,
        SHIBA_INU,
        ST_BERNARD
    }

    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT Variables
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_PROBABILITY = 100;
    string[3] internal s_dogTokenUris;
    uint256 internal immutable i_mintFee;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[3] memory dogTokenUris,
        uint256 mintFee
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Randon IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_dogTokenUris = dogTokenUris;
        i_mintFee = mintFee;
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) revert RandomIpfsNft__NotEnoughEthToPayFee();

        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;

        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address nftOwner = s_requestIdToSender[requestId];
        uint256 tokenId = s_tokenCounter;

        uint256 moddedRng = randomWords[0] % MAX_PROBABILITY;
        Breed dogBreed = getBreedFromModdedRng(moddedRng);

        _safeMint(nftOwner, tokenId);
        _setTokenURI(tokenId, s_dogTokenUris[uint256(dogBreed)]);
    }

    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 sum = 0;
        uint256[3] memory probArray = getProbabilityArray();

        for (uint256 i = 0; i < probArray.length; i++) {
            if (moddedRng >= sum && moddedRng < (sum + probArray[i])) {
                return Breed(i);
            }
            sum += probArray[i];
        }

        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function getProbabilityArray() public pure returns (uint256[3] memory) {
        // Pug: 0 - 9  (10%)
        // Shiba Inu: 10 - 39  (30%)
        // St. Bernard: 40 - 99 (60%)
        return [10, 30, MAX_PROBABILITY];
    }

    function tokenURI(uint256) public view override returns (string memory) {}
}
