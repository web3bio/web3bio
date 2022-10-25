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
  return useSWR(
    NFTSCAN_BASE_API_ENDPOINT + `account/own/all/${address}?erc_type=erc721`,
    fetcher
  );
};
