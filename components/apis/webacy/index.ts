export const WEBACY_API_ENDPOINT = "https://api.webacy.com";
export const WBEACY_DAPP_ENDPOINT = "https://dapp.webacy.com";
const apiKey = process.env.NEXT_PUBLIC_WEBACY_API_KEY;
export const webacyFetcher = async (url) => {
  console.time("Webacy API call");
  try {
    console.log(apiKey, "key");
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey || "",
      },
      next: { revalidate: 86400 },
    });
    console.timeEnd("Webacy API call");
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};
