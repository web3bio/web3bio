export const ENS_METADATA_END_POINT =
  "https://metadata.ens.domains/mainnet/avatar";
export const ENSFetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
};