import urlcat from "urlcat";

export const RSS3_END_POINT = "https://pregod.rss3.dev/v1/";
export const RSS3Fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};

export function getPoaps(address: string): Promise<Response> {
  const url = urlcat("https://hub.pass3.me/assets/list", {
    personaID: address,
    type: "POAP",
  });

  return RSS3Fetcher(url);
}
