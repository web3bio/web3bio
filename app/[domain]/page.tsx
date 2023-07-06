import { fetchInitialNFTsData } from "../../hooks/api/fetchProfile";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { handleSearchPlatform } from "../../utils/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfileMain from "../../components/profile/ProfileMain";

function mapLinks(links) {
  return Object.entries(links || {}).map(([key, value]) => ({
    platform: key,
    ...(value as any),
  }));
}

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
  if (!domain) notFound();
  try {
    const platform = handleSearchPlatform(domain);
    if (
      ![
        PlatformType.ens,
        PlatformType.farcaster,
        PlatformType.lens,
        PlatformType.ethereum,
      ].includes(platform)
    )
      notFound();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${(platform ===
      PlatformType.ethereum
        ? PlatformType.ens
        : platform
      ).toLowerCase()}/${domain}`,
      {
        cache: "no-store",
      }
    );
    if (response.status === 404) notFound();
    const data = await response.json();
    if (!data || data.error) throw new Error(data.error);
    const remoteNFTs = await fetchInitialNFTsData(data?.address);

    return {
      data: { ...data, links: mapLinks(data?.links) },
      nfts: { ...remoteNFTs, nfts: mapNFTs(remoteNFTs?.nfts) },
      platform,
    };
  } catch (e) {
    notFound();
  }
}

export async function generateMetadata({
  params: { domain },
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const res = await fetchDataFromServer(domain);
  if (!res) notFound();
  const { data, platform } = res;
  const pageTitle =
    data?.identity == data?.displayName
      ? `${data?.displayName}`
      : `${data?.displayName} (${data?.identity})`;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio/";
  const profileDescription =
    data.description ||
    `Explore ${pageTitle} ${
      SocialPlatformMapping(platform!).label
    } Web3 identity profile, description, crypto addresses, social links, NFT collections, POAPs, Web3 social feeds, crypto assets etc on the Web3.bio Link in bio page.`;
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
          url: data.avatar || `/img/web3bio-social.jpg`,
        },
      ],
    },
  };
}

export default async function ProfilePage({
  params: { domain },
}: {
  params: { domain: string };
}) {
  const serverData = await fetchDataFromServer(domain);
  const { data, nfts, platform } = serverData;
  const pageTitle =
    data.identity == data.displayName
      ? `${data.displayName}`
      : `${data.displayName} (${data.identity})`;
  return (
    <ProfileMain
      nfts={nfts}
      data={data}
      pageTitle={pageTitle}
      platform={platform}
    />
  );
}
