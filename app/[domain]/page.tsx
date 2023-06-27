import { fetchInitialNFTsData } from "../../hooks/api/fetchProfile";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
import { handleSearchPlatform } from "../../utils/utils";
import { notFound } from "next/navigation";
import ProfileMain from "../../components/profile/ProfileMain";
import { Metadata } from "next";

function mapLinks(links) {
  return Object.entries(links || {}).map(([key, value]) => ({
    platform: key,
    ...(value as any),
  }));
}

function mapNFTs(nfts) {
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
async function getData(domain: string) {
  if (!domain) return null;
  try {
    const platform = handleSearchPlatform(domain);
    if (
      ![
        PlatformType.ens,
        PlatformType.farcaster,
        PlatformType.twitter,
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
      ).toLowerCase()}/${domain}`
    );

    if (response.status == 404) notFound();
    if (response.status === 504)
      return { props: { data: { error: "Timeout" } } };
    const data = await response.json();
    const remoteNFTs = await fetchInitialNFTsData(data?.identity);

    return {
      data: { ...data, links: mapLinks(data?.links) },
      nfts: { ...remoteNFTs, nfts: mapNFTs(remoteNFTs?.nfts) },
      platform,
    };
  } catch (e) {
    return { data: { error: e.message } };
  }
}

export async function generateMetadata({
  params: { domain },
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const serverData = await getData(domain);
  if (!serverData) return {};
  const { data, platform } = serverData;
  const pageTitle =
    data?.identity == data?.displayName
      ? `${data?.displayName}`
      : `${data?.displayName} (${data?.identity})` || domain;
  return {
    title: `${pageTitle} - Web3.bio`,
    description:
      data.description ||
      `Explore ${pageTitle} ${
        SocialPlatformMapping(platform!).label
      } Web3 identity profile, description, crypto addresses, social links, NFT collections, POAPs, Web3 social feeds, crypto assets etc on the Web3.bio Link in bio page.`,
    openGraph: {
      images: [
        {
          url:
            data.avatar ||
            `${process.env.NEXT_PUBLIC_BASE_URL}/img/web3bio-social.jpg`,
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
  const serverData = await getData(domain);
  if (!serverData || serverData?.data?.error) notFound();
  const { data, nfts, platform } = serverData;
  const pageTitle =
    data.identity == data.displayName
      ? `${data.displayName}`
      : `${data.displayName} (${data.identity})`;

  return (
    <div className="web3-profile container grid-xl">
      <ProfileMain
        nfts={nfts}
        data={data}
        pageTitle={pageTitle}
        platform={platform}
      />
    </div>
  );
}
