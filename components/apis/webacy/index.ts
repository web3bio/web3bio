export const WEBACY_API_ENDPOINT = "https://api.webacy.com";
const AUTHENTICATION = process.env.NEXT_PUBLIC_WEBACY_API_KEY;
export const webacyFetcher = async (url) => {
  console.time("Webacy API call");
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-api-key": AUTHENTICATION || "",
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
