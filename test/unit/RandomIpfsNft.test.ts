import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { rejects } from "assert";
import { expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { RandomIpfsNft, VRFCoordinatorV2Mock } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfsNft", async () => {
      let randomIpfsNft: RandomIpfsNft,
        deployer: SignerWithAddress,
        vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      const name = "Random IPFS NFT";
      const symbol = "RIN";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);

        process.env.UPLOAD_TO_PINATA = "false";

        randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
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

      describe("requestNft()", async () => {
        it("fails if payment isn't sent with the request", async () => {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWithCustomError(
            randomIpfsNft,
            "RandomIpfsNft__NotEnoughEthToPayFee"
          );
        });

        it("emits an event and kicks off a random word request", async () => {
          const fee = await randomIpfsNft.getMintFee();
          await expect(randomIpfsNft.requestNft({ value: fee })).to.emit(
            randomIpfsNft,
            "NftRequested"
          );
        });
      });

      describe("fulfillRandomWords()", async () => {
        it("mints NFT after random number returned", async () => {
          await new Promise<void>(async (resolve, reject) => {
            randomIpfsNft.once("NftMinted", async () => {
              try {
                // Write Tests Here !!!!!!!
                resolve();
              } catch (error) {
                reject(error);
              }
            });

            try {
              const fee = await randomIpfsNft.getMintFee();
              const txnResponse = await randomIpfsNft.requestNft({ value: fee });
              const txnReceipt = await txnResponse.wait(1);
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                txnReceipt.events![1].args!.requestId,
                randomIpfsNft.address
              );
            } catch (error) {
              console.log(error);
              reject(error);
            }
          });
        });
      });
    });
