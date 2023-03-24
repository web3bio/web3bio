type LinksItem = {
  link: string | null;
  handle: string | null;
};
type LinksData = {
  twitter?: LinksItem;
  github?: LinksItem;
  telegram?: LinksItem;
  discord?: LinksItem;
  reddit?: LinksItem;
};
type AddressesData = {
  eth?: string | null;
  btc?: string | null;
  ltc?: string | null;
  doge?: string | null;
};
export type ENSResponseData = {
  owner: string | null;
  identity: string | null;
  displayName: string | null;
  avatar: string | null;
  email: string | null;
  description: string | null;
  location: string | null;
  header: string | null;
  notice: string | null;
  keywords: string | null;
  links: LinksData | null;
  addresses: AddressesData | null;
  error?: string;
};
