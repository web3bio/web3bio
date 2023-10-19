export const RSS_ENDPOINT = "https://contenthash.web3.bio/api/";
export const RSSFetcher = async (url) => {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};
export const fetchHasRss = async (domain) => {
  try {
    const res = await fetch(`${RSS_ENDPOINT}rss?query=${domain}&mode=list`, {
      method: "HEAD",
      next: { revalidate: 86400 },
    });
    if (res?.ok) return true;
    return false
  } catch (e) {
    return false;
  }
};
