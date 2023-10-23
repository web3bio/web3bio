
export const RSS3_ENDPOINT = "https://testnet.rss3.io/";
export const RSS3Fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};

