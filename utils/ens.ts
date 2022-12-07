import { ethers } from "ethers";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";

const EthereumRPC = "https://rpc.ankr.com/eth";

const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ens = new ENS({ provider, ensAddress: getEnsAddress("1") });

const globalRecordKeys = [
  "com.github",
  "com.discord",
  "com.reddit",
  "com.twitter",
  "org.telegram",
  "vnd.twitter",
  "vnd.github",
  "url",
];

export { ens, globalRecordKeys };
