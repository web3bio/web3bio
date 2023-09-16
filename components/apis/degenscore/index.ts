export const DEGENSCORE_ENDPOINT = "https://beacon.degenscore.com/v2/beacon/";
export const DegenFetcher = async (url) => {
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
