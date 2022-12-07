
export const NFTSCAN_BASE_API_ENDPOINT = "https://restapi.nftscan.com/api/v2/";
const AUTHENTICATION = process.env.NFTSCAN_API_KEY;
export const NFTSCANFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      "x-api-key": AUTHENTICATION,
    },
  });
  return res.json();
};
