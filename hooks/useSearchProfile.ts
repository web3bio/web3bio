import { PlatformType } from "../utils/platform";
import useSWRMutation from "swr/mutation";

interface SearchProfileProps {
  handle: string;
  platform: PlatformType;
}
export function useSearchProfile(props: SearchProfileProps) {
  const { handle, platform } = props;
  return useSWRMutation(
    "useSearchProfile",
    async () => {
      if(!handle || !platform) return null
      try {
        const host = window.location.origin ||  "https://staging.web5.bio";
        const url = host + `/api/profile/${platform.toLowerCase()}/${handle}`;
        const res =  await fetch(url, { next: { revalidate: 600 } })
        return await res.json();
      } catch (e) {
        console.error(e, "fetchProfile error");
        return null;
      }
    },
    {
      revalidate: false,
    }
  );
}
