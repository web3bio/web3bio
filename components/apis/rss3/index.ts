export const RSS3_ENDPOINT = "https://testnet.rss3.io/";
export const RSS3Fetcher = async (url, options?) => {
  console.time("RSS3 API call");
  try {
    const res = await fetch(url, options).then((r) => r.json());
    console.timeEnd("RSS3 API call");
    return res;
  } catch {
    return null;
  }
};