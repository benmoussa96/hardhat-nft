import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { RandomIpfsNft } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfsNft", async () => {
      let randomIpfsNft: RandomIpfsNft, deployer: SignerWithAddress;
      const name = "Random IPFS NFT";
      const symbol = "RIN";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
      });

      describe("constructor()", () => {
        it("sets the name correctly", async () => {
          const txnResponse = await randomIpfsNft.name();
          expect(txnResponse).to.equal(name);
        });

        it("sets the symbol correctly", async () => {
          const txnResponse = await randomIpfsNft.symbol();
          expect(txnResponse).to.equal(symbol);
        });

        it("sets the counter correctly", async () => {
          const txnResponse = await randomIpfsNft.getTokenCounter();
          expect(txnResponse).to.equal(0);
        });
      });
    });
