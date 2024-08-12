import { PlatformType } from "./platform";

export interface ParamsType {
  params: {
    handle: string;
  };
}

export type LinksItem = {
  link: string | null;
  handle: string | null;
};

export interface ErrorHandleProps {
  identity: string | null;
  code: number;
  message: ErrorMessages | string;
  platform: PlatformType | null;
  headers?: HeadersInit;
}

export enum ErrorMessages {
  notFound = "Not Found",
  invalidResolver = "Invalid Resolver Address",
  invalidResolved = "Invalid Resolved Address",
  notExist = "Does Not Exist",
  invalidIdentity = "Invalid Identity or Domain",
  invalidAddr = "Invalid Address",
  unknownError = "Unknown Error Occurs",
  networkError = "Network Error",
}

export interface ProofRecord {
  platform: string;
  identity: string;
  displayName: string;
}
export interface NeighborDetail {
  platform: PlatformType;
  identity: string;
  uuid: string;
  displayName: string;
}

export interface ProfileInterface {
  uuid: string;
  address: string;
  addresses: Record<string, string>;
  avatar: string | null;
  description: string | null;
  platform: PlatformType;
  displayName: string | null;
  email: string | null;
  header: string | null;
  identity: string;
  location: string | null;
  links: Record<
    PlatformType,
    {
      link: string;
      handle: string;
    }
  >;
}

export type ProfileAPIResponse = ProfileInterface & {
  error?: string;
};

export interface RelationServiceQueryResponse {
  data: {
    identity: IdentityRecord & {
      identityGraph: {
        vertices: IdentityRecord[];
      };
    };
  };
}

export interface IdentityRecord {
  uuid: string;
  identity: string;
  platform: PlatformType;
  displayName: string;
  reverse: boolean;
  expiredAt: string;
}

export interface Token {
  id: `0x${string}`;
  chain: string;
  name: string;
  symbol: string;
  display_symbol: string | null;
  optimized_symbol: string;
  decimals: number;
  logo_url: string | null;
  protocol_id: number;
  price: number;
  price_24h_change: string | null;
  is_verified: boolean;
  is_core: boolean;
  is_wallet: boolean;
  time_at: number;
  amount: number;
  raw_amount: number;
  raw_amount_hex_str: string;
}
