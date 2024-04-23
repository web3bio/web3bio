import { PlatformType, SocialPlatformMapping } from "../../components/utils/platform";
import { shouldPlatformFetch, handleSearchPlatform, mapLinks } from "../../components/utils/utils";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import ProfileMain from "../../components/profile/ProfileMain";
import { regexAvatar } from "../../components/utils/regexp";

async function fetchDataFromServer(domain: string) {
  if (!domain) return null;
  try {
    const platform = handleSearchPlatform(domain);
    const useSolana = [PlatformType.sns, PlatformType.solana].includes(
      platform
    );

    if (!shouldPlatformFetch(platform)) return null;
    const url = `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile${
      useSolana ? "/solana/" : ""
    }/${domain}`;
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (response.status === 404) return null;
    const data = await response.json();
    return {
      data: useSolana ? [data] : data,
      platform,
    };
  } catch (e) {
    console.log(e, "ERROR");
    return null;
  }
}

export async function generateMetadata({
  params: { domain },
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const res = await fetchDataFromServer(domain);
  if (!res) {
    if (regexAvatar.test(domain)) {
      redirect(`/?s=${domain}`);
    } else {
      notFound();
    }
  }
  const { data, platform } = res;
  const profile = data[0];
  const pageTitle =
    profile?.identity == profile?.displayName
      ? `${profile?.displayName}`
      : `${profile?.displayName} (${profile?.identity})`;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";

  const profileDescription =
    profile?.description ||
    `Explore ${pageTitle} ${
      SocialPlatformMapping(platform!).label
    } profile, connected identities, social links, NFT collections, Web3 activities, dWebsites, POAPs etc on the Web3.bio profile page.`;
  const avatarURL = data?.find((x) => !!x.avatar)?.avatar;

  const params = new URLSearchParams();
  if (domain) params.append("path", domain);
  if (profile) params.append("address", profile.address);
  params.append("displayName", profile.displayName);
  if (profile.description) params.append("description", profile.description);
  if (avatarURL) params.append("avatar", avatarURL);
  const relativeOGURL = params.toString()
    ? `/api/og?${params.toString()}`
    : "/api/og";

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:image": `${baseURL}${relativeOGURL}`,
  };
  JSON.parse(JSON.stringify(data))
    .splice(0, 3)
    .filter((o) => o.identity !== "")
    .map((x, index) => {
      const resolvedIdentity = `${x.identity}${
        x.platform === PlatformType.farcaster ? ".farcaster" : ""
      }`;
      fcMetadata[`fc:frame:button:${index + 1}`] = SocialPlatformMapping(
        x.platform
      ).label;
      fcMetadata[`fc:frame:button:${index + 1}:action`] = "link";
      fcMetadata[
        `fc:frame:button:${index + 1}:target`
      ] = `${baseURL}/${resolvedIdentity}`;
    });

  const defaultIdx = data.length > 3 ? 4 : data.length + 1;
  fcMetadata[`fc:frame:button:${defaultIdx}`] = "🌐 🖼 🌈 More";
  fcMetadata[`fc:frame:button:${defaultIdx}:action`] = "link";
  fcMetadata[`fc:frame:button:${defaultIdx}:target`] = `${baseURL}/${domain}`;

  return {
    metadataBase: new URL(baseURL),
    title: pageTitle + ` ${SocialPlatformMapping(platform!).label} Profile`,
    description: profileDescription,
    alternates: {
      canonical: `/${domain}`,
    },
    openGraph: {
      type: "website",
      url: `/${domain}`,
      siteName: "Web3.bio",
      title: pageTitle + ` ${SocialPlatformMapping(platform!).label} Profile`,
      images: [relativeOGURL],
      description: profileDescription,
    },
    twitter: {
      title: pageTitle + ` ${SocialPlatformMapping(platform!).label} Profile`,
      description: profileDescription,
      site: "@web3bio",
      images: [relativeOGURL],
      creator: "@web3bio",
    },
    other: {
      ...fcMetadata,
    },
  };
}

export default async function ProfilePage({
  params: { domain },
}: {
  params: { domain: string };
}) {
  const serverData = await fetchDataFromServer(domain);
  if (!serverData) notFound();
  const { data, platform } = serverData;
  const profile = data[0];
  const pageTitle =
    profile.identity == profile.displayName
      ? `${profile.displayName}`
      : `${profile.displayName} (${profile.identity})`;
  return (
    <ProfileMain
      domain={domain}
      relations={
        data?.map((x) => ({
          platform: x.platform,
          identity: x.identity,
        })) || []
      }
      data={{
        ...data[0],
        links: mapLinks(data),
      }}
      fallbackAvatar={{
        source: data?.find((x) => !!x.avatar)?.platform,
        avatar: data?.find((x) => !!x.avatar)?.avatar,
      }}
      pageTitle={pageTitle}
      platform={platform}
    />
  );
}

export const runtime = "edge";
export const revalidate = 432000;
