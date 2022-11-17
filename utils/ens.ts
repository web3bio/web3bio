import { ethers } from "ethers";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";

const EthereumRPC = "https://rpc.ankr.com/eth";

const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ens = new ENS({ provider, ensAddress: getEnsAddress("1") });

const globalRecordKeys = {
  base: ["avatar", "description", "display"],
  socialMedia: [
    "com.github",
    "com.discord",
    "com.reddit",
    "con.twitter",
    "org.telegram",
  ],
};



export { ens, globalRecordKeys };
