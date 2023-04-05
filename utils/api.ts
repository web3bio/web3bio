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
    linkedin?: LinksItem;
    website?: LinksItem;
    farcaster?: LinksItem;
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
    notice?: string | null;
    keywords?: string | null;
    links: LinksData | null;
    addresses: AddressesData | null;
    error?: string;
  };
  
  export const CoinType = {
    btc: 0,
    ltc: 2,
    doge: 3,
    // dash: 5,
    // monacoin: 22,
    eth: 60,
    etc: 61,
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
    xdai: 700,
    matic: 2147483785,
  };
  