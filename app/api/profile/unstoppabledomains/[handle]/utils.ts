import { ErrorMessages } from "../../../../../components/utils/types";
import { isValidEthereumAddress } from "../../../../../components/utils/utils";

const UDBaseEndpoint = "https://api.unstoppabledomains.com/";
const UDProfileEndpoint = "https://profile.unstoppabledomains.com/api/public/";

const fetchUDBase = async (path: string) => {
  return fetch(UDBaseEndpoint + path, {
    method: "GET",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_UD_API_KEY || "",
    },
  }).then((res) => res.json());
};
const fetchUDProfile = async (domain: string) => {
  return fetch(
    `${UDProfileEndpoint}/${domain}?fields=profile,records,socialAccounts`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
};

export const resolveUDResponse = async (handle: string) => {
  let address;
  let domain;
  if (isValidEthereumAddress(handle)) {
    const res = await fetchUDBase(`resolve/reverse/${handle}`);
    if (!res?.meta) {
      throw new Error(ErrorMessages.notFound, { cause: 404 });
    }
    address = handle;
    domain = res.meta.domain;
  } else {
    const res = await fetchUDBase(`resolve/domains/${handle}`);

    if (!res?.meta) {
      throw new Error(ErrorMessages.notFound, { cause: 404 });
    }
    domain = res.meta.domain || handle;
    address = res.meta.owner.toLowerCase();
  }
  const metadata = await fetchUDProfile(domain);

  return { address, domain, metadata };
};
