export const RSS_ENDPOINT = "https://contenthash.web3.bio/api/";

export const RSSFetcher = async (url) => {
  console.time("RSS API call");
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (res.status != 200) return [];
    console.timeEnd("RSS API call");
    return res.json();
  } catch (e) {
    return [];
  }
};
