export const DEGENSCORE_ENDPOINT = "https://beacon.degenscore.com/v2/beacon/";
export const DegenFetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};
