export const RSS3_ENDPOINT = "https://api.rss3.io/v1";
export const RSS3Fetcher = async ([url,data]) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    return res;
  } catch {
    return null;
  }
};
