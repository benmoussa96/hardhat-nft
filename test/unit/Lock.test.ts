import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { BasicNFT } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lock", async () => {
      let basicNFT: BasicNFT, deployer: SignerWithAddress;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        basicNFT = await ethers.getContract("BasicNFT", deployer);
      });

      describe("constructor()", () => {
        it("sets the owner addresses correctly", async () => {
          const txnResponse = await basicNFT.getOwner();
          expect(txnResponse).to.equal(deployer.address);
        });
      });
    });
