import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export interface NetworkConfigItem {
  name?: string;
  blockConfirmations?: number;
  vrfCoordinatorV2?: string;
  gasLane?: string;
  subscriptionId?: string;
  callbackGasLimit?: string;
  dogTokenUris?: string[];
  mintFee?: BigNumber;
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
  1: {
    name: "mainnet",
    blockConfirmations: 6,
  },
  5: {
    name: "goerli",
    blockConfirmations: 6,
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "8830",
    callbackGasLimit: "500000",
    dogTokenUris: [
      "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
      "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
      "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
    ],
    mintFee: ethers.utils.parseEther("0.01"),
  },
  137: {
    name: "polygon",
    blockConfirmations: 6,
  },
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
