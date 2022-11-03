
export const ALCHEMY_ETHEREUM_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/`;
const AUTHENTICATION = "";

export const AlchemyFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  });
  return res.json();
};
