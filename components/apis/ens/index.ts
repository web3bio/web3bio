export const ENS_METADATA_END_POINT =
  "https://metadata.ens.domains/mainnet/avatar";
export const _fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: { "content-type": "application/json" },
  });
  return res.json();
};
