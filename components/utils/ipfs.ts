import urlcat from "urlcat";
const MATCH_IPFS_CID_RAW =
  "Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[2-7A-Za-z]{58,}|B[2-7A-Z]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[\\dA-F]{50,}";
const CORS_HOST = "https://cors-next.r2d2.to";
const IPFS_GATEWAY_HOST = "https://cloudflare-ipfs.com";
const MATCH_IPFS_DATA_RE = /ipfs\/(data:.*)$/;
const MATCH_IPFS_CID_RE = new RegExp(`(${MATCH_IPFS_CID_RAW})`);
const MATCH_IPFS_CID_AT_STARTS_RE = new RegExp(
  `^https://(?:${MATCH_IPFS_CID_RAW})`
);
const MATCH_IPFS_CID_AND_PATHNAME_RE = new RegExp(
  `(?:${MATCH_IPFS_CID_RAW})\\/?.*`
);

export const resolveIPFS_CID = (str: string) => {
  return str.match(MATCH_IPFS_CID_RE)?.[1];
};
const trimQuery = (url: string) => {
  return url.replace(/\?.+$/, "");
};

export const isIPFS_Resource = (str: string) => {
  return MATCH_IPFS_CID_RE.test(str);
};

export function resolveIPFS_URL(
  cidOrURL: string | undefined
): string | undefined {
  if (!cidOrURL) return cidOrURL;

  // eliminate cors proxy
  if (cidOrURL.startsWith(CORS_HOST)) {
    return trimQuery(
      resolveIPFS_URL(
        decodeURIComponent(cidOrURL.replace(new RegExp(`^${CORS_HOST}\??`), ""))
      )!
    );
  }

  // ipfs.io host
  if (cidOrURL.startsWith("https://ipfs.io")) {
    // base64 data string
    const [_, data] = cidOrURL.match(MATCH_IPFS_DATA_RE) ?? [];
    if (data) return decodeURIComponent(data);

    // plain
    return trimQuery(decodeURIComponent(cidOrURL));
  }

  // a ipfs hash fragment
  if (isIPFS_Resource(cidOrURL) || cidOrURL.includes("ipfs:")) {
    // starts with a cid
    if (cidOrURL.includes("ipfs://")) {
      cidOrURL = cidOrURL.replace("ipfs://", "");
    }
    if (MATCH_IPFS_CID_AT_STARTS_RE.test(cidOrURL)) {
      try {
        const u = new URL(cidOrURL);
        const cid = resolveIPFS_CID(cidOrURL);

        if (cid) {
          if (u.pathname === "/") {
            return resolveIPFS_URL(
              urlcat(`${IPFS_GATEWAY_HOST}/ipfs/:cid`, {
                cid,
              })
            );
          } else {
            return resolveIPFS_URL(
              urlcat(`${IPFS_GATEWAY_HOST}/ipfs/:cid/:path`, {
                cid,
                path: u.pathname.slice(1),
              })
            );
          }
        }
      } catch (error) {
       
        // do nothing
      }
    }

    const pathname = cidOrURL.match(MATCH_IPFS_CID_AND_PATHNAME_RE)?.[0];
    if (pathname) return trimQuery(`${IPFS_GATEWAY_HOST}/ipfs/${pathname}`);
  }

  return cidOrURL;
}
