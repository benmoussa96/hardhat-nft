import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { BasicNFT } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Lock", async () => {
      let basicNFT: BasicNFT, deployer: SignerWithAddress;
      const name = "Dogie";
      const symbol = "DOG";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        basicNFT = await ethers.getContract("BasicNFT", deployer);
      });

      describe("constructor()", () => {
        it("sets the name correctly", async () => {
          const txnResponse = await basicNFT.name();
          expect(txnResponse).to.equal(name);
        });

        it("sets the symbol correctly", async () => {
          const txnResponse = await basicNFT.symbol();
          expect(txnResponse).to.equal(symbol);
        });

        it("sets the counter correctly", async () => {
          const txnResponse = await basicNFT.getTokenCounter();
          expect(txnResponse).to.equal(0);
        });
      });
    });
