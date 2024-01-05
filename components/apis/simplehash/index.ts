export const SIMPLEHASH_URL = "https://simplehash-proxy.r2d2.to";
export const SIMPLEHASH_CHAINS =
  "ethereum,polygon,base,bsc,arbitrum,scroll,linea,optimism,zora,flow,gnosis,manta";
export const SIMPLEHASH_PAGE_SIZE = 40;

export const SimplehashFetcher = async (url: string, options?) => {
  try {
    console.time("SimpleHash API call");
    const res = await fetch(url, options).then((res) => res.json());
    console.timeEnd("SimpleHash API call");
    return res;
  } catch (e) {
    return null;
  }
};
