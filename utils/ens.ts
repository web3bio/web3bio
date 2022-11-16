import { ENS } from "@ensdomains/ensjs";
import { ethers } from "ethers";

const EthereumRPC = "https://rpc.ankr.com/eth";

const provider = new ethers.providers.JsonRpcProvider(EthereumRPC, 1);

const ENSInstance = new ENS();

const setProvider = async () => {
  await ENSInstance.setProvider(provider);
};
setProvider();
// const setProvider = async () => {

export { provider, ENSInstance };
