import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs";

interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes: {}[];
}

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

export const storeImages = async (imagesFilePath: string) => {
  const fullImagesPath = path.resolve(imagesFilePath);
  const images = fs.readdirSync(fullImagesPath);

  let responses = [];
  for (const i in images) {
    console.log(`Uploading ${images[i]} to IPFS...`);
    const imageReadableStream = fs.createReadStream(`${fullImagesPath}/${images[i]}`);
    try {
      const pinataResponse = await pinata.pinFileToIPFS(imageReadableStream, {
        pinataMetadata: { name: images[i] },
      });
      responses.push(pinataResponse);
    } catch (error) {
      console.log(error);
    }
  }

  return { responses, images };
};

export const storeTokenUriMetadata = async (metadata: Metadata) => {
  const name = `${metadata.name}.json`;
  console.log(`Uploading ${name} to IPFS...`);

  try {
    const response = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name },
    });
    return response;
  } catch (error) {
    console.log(error);
  }

  return null;
};
