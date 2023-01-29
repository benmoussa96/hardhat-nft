import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

export const storeImages = async (imagesFilePath: string) => {
  const fullImagesPath = path.resolve(imagesFilePath);
  const images = fs.readdirSync(fullImagesPath);
  console.log(images);

  let responses = [];
  for (const i in images) {
    const imageReadableStream = fs.createReadStream(`${fullImagesPath}/${images[i]}`);
    try {
      const pinataResponse = await pinata.pinFileToIPFS(imageReadableStream);
      responses.push(pinataResponse);
    } catch (error) {
      console.log(error);
    }
  }

  return { responses, images };
};
