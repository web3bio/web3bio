export const SIMPLEHASH_URL = "https://simplehash-proxy.r2d2.to";
export const SIMPLEHASH_CHAINS =
  "ethereum,solana,base,gnosis,linea,optimism,zora,flow";
export const SIMPLEHASH_PAGE_SIZE = 40;

export const SimplehashFetcher = async (url: string, options?) => {
  try {
    console.time("simplehash api call");
    const res = await fetch(url, options).then((res) => res.json());
    console.timeEnd("simplehash api call");
    return res;
  } catch (e) {
    return null;
  }
};
