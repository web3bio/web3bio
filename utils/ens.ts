import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";

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

export { ens, globalRecordKeys };
