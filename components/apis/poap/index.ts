const AUTHENTICATION = process.env.NEXT_PUBLIC_POAP_API_KEY;
export const POAP_ENDPOINT = "https://api.poap.tech/actions/scan/";
export const POAPFetcher = async (url) => {
  console.time("POAPs API call");
  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-api-key": AUTHENTICATION || "",
      },
      next: { revalidate: 86400 },
    });
    console.timeEnd("POAPs API call");
    if (res.status != 200) return [];
    return res.json();
  } catch (e) {
    return [];
  }
};
