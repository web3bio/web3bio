import useSWR from "swr";

const NFTSCAN_BASE_API_ENDPOINT = "https://restapi.nftscan.com/api/v2/";
const AUTHENTICATION = "wHWILNXM";
const fetcher = (url) => {
  fetch(url, {
    headers: {
      "x-api-key": AUTHENTICATION,
    },
  }).then((res) => res.json());
};

export const useNFTCollectionsByAddress = (address: string) => {
  const URL =
    NFTSCAN_BASE_API_ENDPOINT + `account/own/all/${address}?erc_type=erc721`;
  console.log(URL,'url')
  return useSWR(URL, fetcher);
};
