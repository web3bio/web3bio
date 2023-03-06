import { ENS } from "@ensdomains/ensjs";
import { ethers } from "ethers";
import {
  NFTSCANFetcher,
  NFTSCAN_BASE_API_ENDPOINT
} from "../components/apis/nftscan";
import { resolveIPFS_URL } from "./ipfs";

const EthereumRPC = "https://rpc.ankr.com/eth";

export const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ens = new ENS();

const globalRecordKeys = [
  "description",
  "url",
  "com.github",
  "com.twitter",
  "org.telegram",
  "com.discord",
  "com.reddit",
  "vnd.twitter",
  "vnd.github",
];

export const getContractSpecImage = async (params) => {
  if (!params || params.length < 2) return "";
  const addr = params[0];
  const tokenId = params[1];
  const res = await NFTSCANFetcher(
    NFTSCAN_BASE_API_ENDPOINT + `assets/${addr}/${tokenId}`
  );
  return resolveIPFS_URL(res.data.image_uri || res.data.content_uri);
};

export { ens, globalRecordKeys };
