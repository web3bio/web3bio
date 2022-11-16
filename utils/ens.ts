import { ENS } from "@ensdomains/ensjs";
import { ethers } from "ethers";

const EthereumRPC = "https://eth-mainnet.g.alchemy.com/v2/";

const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ENSInstance = new ENS();

// const setProvider = async () => {

export { provider, ENSInstance };
