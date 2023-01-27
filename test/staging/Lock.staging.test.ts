import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { BasicNFT } from "../../typechain-types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("BasicNFT", async () => {
      let basicNFT: BasicNFT, deployer: SignerWithAddress;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        basicNFT = await ethers.getContract("BasicNFT", deployer);
      });

      it("", async () => {});
    });
