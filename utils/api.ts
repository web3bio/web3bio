import { NextApiResponse } from "next";


export const Web3bioProfileAPIEndpoint = 'https://api.web3.bio'

export type LinksItem = {
  link: string | null;
  handle: string | null;
};
export type LinksData = {
  [index: string]: LinksItem;
};
type AddressesData = {
  eth?: string | null;
  btc?: string | null;
  ltc?: string | null;
  doge?: string | null;
  matic?: string | null;
};
export type HandleResponseData = {
  owner: string | null;
  identity: string | null;
  displayName: string | null;
  avatar: string | null;
  email: string | null;
  description: string | null;
  location: string | null;
  header: string | null;
  links: LinksData | null;
  addresses: AddressesData | null;
  error?: string;
};

export type HandleNotFoundResponseData = {
  identity: string | null;
  error: string;
};

export const CoinType = {
  btc: 0,
  ltc: 2,
  doge: 3,
  // dash: 5,
  // monacoin: 22,
  eth: 60,
  // etc: 61,
  // xrp: 145,
  // atom: 118,
  // rootstock: 137,
  // ripple: 144,
  // bch: 145,
  // bnb: 714,
  // xlm: 148,
  // rsk: 137,
  // eos: 194,
  // xem: 43,
  // trx: 195,
  // xdai: 700,
  matic: 2147483785,
};

export const errorHandle = (
  handle: string,
  res: NextApiResponse<HandleNotFoundResponseData>
) => {
  res.status(404).json({
    identity: handle,
    error: "No results",
  });
};
