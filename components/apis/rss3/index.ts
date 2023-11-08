export const RSS3_ENDPOINT = "https://testnet.rss3.io";
export const RSS3Fetcher = async ([url, data]) => {
  console.time("RSS3 API call");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    console.timeEnd("RSS3 API call");
    return res;
  } catch {
    return null;
  }
};