const WarpcastAPIEndpoint = "https://api.warpcast.com/";

export const waprcastFetcher = (url: string) => {
  return fetch(WarpcastAPIEndpoint + url, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_FARCASTER_API_KEY || "",
    },
  })
    .then((res) => res.json())
    .catch((e) => null);
};
