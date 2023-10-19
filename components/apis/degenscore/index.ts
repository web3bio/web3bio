export const DEGENSCORE_ENDPOINT = "https://beacon.degenscore.com/v2/beacon/";
export const DegenFetcher = async (url) => {
  try {
    console.time('Degen api call')
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    console.timeLog('Degen api call')
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};

export const fetchHasDegen = async (address) => {
  try {
    const res = await fetch(`${DEGENSCORE_ENDPOINT}${address}`, {
      next: { revalidate: 86400 },
    });
    if (res?.ok) return true;
    return false;
  } catch (e) {
    return false;
  }
};
