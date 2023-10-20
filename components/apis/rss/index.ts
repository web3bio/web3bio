export const RSS_ENDPOINT = "https://contenthash.web3.bio/api/";
const RSS_MAX_DURATION = 2000;

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
export const fetchRss = async (domain) => {
  try {
    const fetchPromise = fetch(`${RSS_ENDPOINT}rss?query=${domain}&mode=list`, {
      next: { revalidate: 86400 },
    }).then((res) => res.json());
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(null), RSS_MAX_DURATION);
    });
    return Promise.race([timeoutPromise, fetchPromise]);
  } catch (e) {
    return null;
  }
};
