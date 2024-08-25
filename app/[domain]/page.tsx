import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { PlatformType, SocialPlatformMapping } from "@/components/utils/platform";
import {
  shouldPlatformFetch,
  handleSearchPlatform,
  mapLinks,
} from "@/components/utils/utils";
import ProfileMain from "@/components/profile/ProfileMain";
import { regexNext } from "@/components/utils/regexp";
import { baseURL, profileAPIBaseURL } from "@/components/utils/api";

async function fetchDataFromServer(domain: string) {
  if (!domain) return null;
  try {
    const platform = handleSearchPlatform(domain);
    if (!shouldPlatformFetch(platform)) return null;

    const url = `${profileAPIBaseURL}/profile/${domain}`;
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });
    if (response.status === 404) return null;

    const data = await response.json();
    return {
      data: data,
      platform,
    };
  } catch (e) {
    console.error("Error fetching data:", e);
    return null;
  }
}

export async function generateMetadata({ params: { domain }, }: { params: { domain: string }; }): Promise<Metadata> {
  const res = await fetchDataFromServer(domain);
  if (!res) {
    if (regexNext.test(domain)) {
      redirect(`/?s=${domain}`);
    } else {
      notFound();
    }
  }
  const { data, platform } = res;
  const profile = data[0];
  const pageTitle =
    profile?.identity === profile?.displayName ?? false
      ? profile?.displayName
      : `${profile?.displayName} (${profile?.identity})`;

  const profileDescription = profile?.description ||
    `Explore ${pageTitle} ${
      SocialPlatformMapping(platform!).label
    } profile, onchain identities, social links, NFT collections, Web3 activities, dWebsites, POAPs etc on the Web3.bio profile page.`;

  const params = new URLSearchParams({
    path: domain,
    address: profile?.address,
    displayName: profile?.displayName,
    ...(profile?.description && { description: profile.description }),
  });

  const avatarProfile = data?.find(x => x.avatar);
  if (avatarProfile) params.append("avatar", avatarProfile.avatar);

  const relativeOGURL = `/api/og${params.toString() ? `?${params.toString()}` : ''}`;

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
      description: profileDescription,
      images: [relativeOGURL],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle + ` ${SocialPlatformMapping(platform!).label} Profile`,
      description: profileDescription,
      images: [relativeOGURL],
      site: "@web3bio",
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
    profile?.identity === profile?.displayName ?? false
      ? profile.displayName
      : `${profile.displayName} (${profile.identity})`;

  return (
    <ProfileMain
      domain={domain}
      relations={data}
      data={{
        ...profile,
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
