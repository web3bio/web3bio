import { Alchemy, Network } from "alchemy-sdk";
export const ALCHEMY_ETHEREUM_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/`;

const config = {
  apiKey: "HlbrO0gpQ7DK1Vveeuw5dRpvNd0LSFO_",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
export const resolveENSDomain = async (walletAddress: string) => {
  const res = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [ensContractAddress],
  });
  return res ? res.ownedNfts : [];
};
