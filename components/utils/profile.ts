import { PlatformType } from "./platform";

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
