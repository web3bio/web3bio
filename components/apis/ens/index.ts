export const ENS_METADATA_END_POINT =
  "https://metadata.ens.domains/mainnet/avatar";
export const _fetcher = async (url: string, options?) => {
  const res = await fetch(url, options);
  return res.json();
};
