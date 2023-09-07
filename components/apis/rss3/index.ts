
export const RSS3_ENDPOINT = "https://pregod.rss3.dev/v1/";
export const RSS3Fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};

