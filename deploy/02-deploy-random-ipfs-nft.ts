import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
import { storeImages, storeTokenUriMetadata } from "../utils/uploadToPinata";

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");
const IMAGES_LOCATION = "./images/randomNFT";

const METADATA_TEMPLATE = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

const deployRandomIpfsNft: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  let vrfCoordinatorV2Address, vrfCoordinatorV2Mock, subId, dogTokenUris;

  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    const subTxnResponse = await vrfCoordinatorV2Mock.createSubscription();
    const subTxnReceipt = await subTxnResponse.wait(1);
    subId = subTxnReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subId, VRF_SUB_FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subId = networkConfig[chainId].subscriptionId;
  }

  if (process.env.UPLOAD_TO_PINATA) {
    dogTokenUris = await handleTokenUris();
    console.log("dogTokenUris:", dogTokenUris);
  } else {
    dogTokenUris = networkConfig[chainId].dogTokenUris;
  }

  const gasLane = networkConfig[chainId].gasLane;
  const callbackGasLimit = networkConfig[chainId].callbackGasLimit;
  const mintFee = networkConfig[chainId].mintFee;

  const args = [
    vrfCoordinatorV2Address,
    subId,
    gasLane,
    callbackGasLimit,
    dogTokenUris,
    mintFee,
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });

  if (developmentChains.includes(network.name)) {
    await vrfCoordinatorV2Mock?.addConsumer(subId, randomIpfsNft.address);
  } else if (process.env.ETHERSCAN_API_KEY) {
    await verify(randomIpfsNft.address, args);
  }
};

const handleTokenUris = async () => {
  let tokenUris = [];

  // Store images in IPFS
  const { responses: imageUploadResponses, images } = await storeImages(IMAGES_LOCATION);

  for (const i in imageUploadResponses) {
    // Create the metadata
    let tokenUriMetadata = { ...METADATA_TEMPLATE };
    tokenUriMetadata.name = images[i].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} puppy!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[i].IpfsHash}`;

    // Store the metadata in IPFS
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata);

    tokenUris.push(`ipfs://${metadataUploadResponse!.IpfsHash}`);
  }

  return tokenUris;
};

export default deployRandomIpfsNft;
deployRandomIpfsNft.tags = ["all", "randomipfsnft"];
