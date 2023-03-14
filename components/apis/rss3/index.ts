
export const RSS3_END_POINT = "https://pregod.rss3.dev/v1/";
export const RSS3Fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};

