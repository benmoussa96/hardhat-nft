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

      describe("mintNft()", () => {
        beforeEach(async () => {
          const txnResponse = await basicNFT.mintNft();
          await txnResponse.wait(1);
        });

        it("Allows users to mint an NFT, and updates appropriately", async () => {
          const tokenURI = await basicNFT.tokenURI(0);
          const tokenCounter = await basicNFT.getTokenCounter();

          expect(tokenCounter).to.equal(1);
          expect(tokenURI).to.equal(await basicNFT.TOKEN_URI());
        });

        it("Show the correct balance and owner of an NFT", async () => {
          const ownerAddress = deployer.address;
          const ownerBalance = await basicNFT.balanceOf(ownerAddress);
          const owner = await basicNFT.ownerOf("0");

          expect(ownerBalance, toString()).to.equal("1");
          expect(owner).to.equal(ownerAddress);
        });
      });
    });
