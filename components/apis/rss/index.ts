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
export const fetchRSS = async (domain) => {
  try {
    return fetch(`${RSS_ENDPOINT}rss?query=${domain}&mode=list`, {
      next: { revalidate: 86400 },
    }).then((res) => res.json());
  } catch (e) {
    return null;
  }
};
