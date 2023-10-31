import { fetchInitialNFTsData } from "../../hooks/api/fetchProfile";
import { PlatformType } from "../../utils/platform";
import { SocialPlatformMapping } from "../../utils/utils";
import {
  handleSearchPlatform,
  mapLinks,
  WEB3BIO_OG_ENDPOINT,
} from "../../utils/utils";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import ProfileMain from "../../components/profile/ProfileMain";
import { regexAvatar } from "../../utils/regexp";

function mapNFTs(nfts) {
  if (!nfts) return [];
  return nfts.map((x) => ({
    image_url: x.image_url,
    previews: x.previews,
    token_id: x.token_id,
    collection: {
      address: x.contract_address,
      collection_id: x.collection.collection_id,
      description: x.collection.description,
      name: x.collection.name,
      image_url: x.collection.image_url,
      spam_score: x.collection.spam_score,
    },
    video_url: x.video_url,
    audio_url: x.audio_url,
    video_properties: x.video_properties,
    image_properties: x.image_properties,
    extra_metadata: x.extra_metadata,
  }));
}

async function fetchDataFromServer(domain: string) {
  if (!domain) return null;
  try {
    const platform = handleSearchPlatform(domain);
    if (
      ![
        PlatformType.ens,
        PlatformType.farcaster,
        PlatformType.lens,
        PlatformType.ethereum,
        PlatformType.dotbit,
        PlatformType.nextid,
      ].includes(platform)
    )
      return null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${domain}`,
      {
        next: { revalidate: 86400 },
      }
    );
    if (response.status === 404) return null;
    const data = await response.json();
    const remoteNFTs = data[0].address
      ? await fetchInitialNFTsData(data[0].address)
      : {};
    return {
      data,
      platform,
      nfts: remoteNFTs,
    };
  } catch (e) {
    console.log(e, "error");
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
    profile.description ||
    `Explore ${pageTitle} ${
      SocialPlatformMapping(platform!).label
    } Web3 identity profile, description, crypto addresses, social links, NFT collections, POAPs, activities etc on the Web3.bio Link in bio page.`;
  return {
    metadataBase: new URL(baseURL),
    title: pageTitle,
    description: profileDescription,
    alternates: {
      canonical: `/${domain}`,
    },
    openGraph: {
      type: "website",
      url: `/${domain}`,
      siteName: "Web3.bio",
      title: pageTitle,
      description: profileDescription,
      images: [
        {
          url: WEB3BIO_OG_ENDPOINT + `api/${profile?.identity ?? ""}`,
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: profileDescription,
      images: [
        {
          url: WEB3BIO_OG_ENDPOINT + `api/${profile?.identity ?? ""}`,
        },
      ],
      site: "@web3bio",
      creator: "@web3bio",
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
  const { data, nfts, platform } = serverData;
  const profile = data[0];
  const pageTitle =
    profile.identity == profile.displayName
      ? `${profile.displayName}`
      : `${profile.displayName} (${profile.identity})`;
  return (
    <ProfileMain
      fromServer
      domain={domain}
      relations={
        data?.map((x) => ({ platform: x.platform, identity: x.identity })) || []
      }
      nfts={{
        ...nfts,
        nfts: mapNFTs(nfts.nfts),
      }}
      data={{
        ...data[0],
        links: mapLinks(data),
      }}
      pageTitle={pageTitle}
      platform={platform}
    />
  );
}

export const runtime = "edge";
export const revalidate = 432000;
