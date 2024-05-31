export const GITCOIN_PASSPORT_API_END_POINT = "https://api.webacy.com";
const apiKey = process.env.NEXT_PUBLIC_GITCOIN_API_KEY;
export const gitcoinFetcher = async (url) => {
  console.time("Gitcoin API call");
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey || "",
      },
      next: { revalidate: 86400 },
    });

    console.timeEnd("webacyFetcher API call");
    if (res.status != 200) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
};
