const AUTHENTICATION = process.env.NEXT_PUBLIC_POAP_API_KEY;
export const POAP_END_POINT = "https://api.poap.tech/actions/scan/";
export const POAPFetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "x-api-key": AUTHENTICATION,
    },
  });
  return res.json();
};
