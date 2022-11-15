import { ENS } from "@ensdomains/ensjs";
import { ethers } from "ethers";

const EthereumRPC = "https://mainnet.infura.io/v3/";

const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ENSInstance = new ENS();

// const setProvider = async () => {

export { provider, ENSInstance };
