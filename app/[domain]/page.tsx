import { fetchInitialNFTsData } from "../../hooks/api/fetchProfile";
import { PlatformType, SocialPlatformMapping } from "../../utils/platform";
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
      `${"https://web3bio-profile-ex11pi35w-web3bio.vercel.app"}/profile/${domain}`
    );
    if (response.status === 404) return null;
    const raw = await response.json();
    const relations = Array.from(
      raw?.map((x) => ({ platform: x.platform, identity: x.identity }))
    );

    const _data = raw.find((x) => x.platform === platform) || raw?.[0];
    if (!_data || _data.error) throw new Error(_data.error);
    const remoteNFTs = _data.address
      ? await fetchInitialNFTsData(_data.address)
      : {};
    return {
      data: { ..._data, links: mapLinks(raw) },
      nfts: { ...remoteNFTs, nfts: mapNFTs(remoteNFTs?.nfts) },
      platform,
      relations,
    };
  } catch (e) {
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
  const pageTitle =
    data?.identity == data?.displayName
      ? `${data?.displayName}`
      : `${data?.displayName} (${data?.identity})`;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
  const profileDescription =
    data.description ||
    `Explore ${pageTitle} ${
      SocialPlatformMapping(platform!).label
    } Web3 identity profile, description, crypto addresses, social links, NFT collections, POAPs, crypto assets etc on the Web3.bio Link in bio page.`;
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
          url: WEB3BIO_OG_ENDPOINT + `api/${data?.identity ?? ""}`,
        },
      ],
    },
    twitter: {
      title: pageTitle,
      description: profileDescription,
      images: [
        {
          url: WEB3BIO_OG_ENDPOINT + `api/${data?.identity ?? ""}`,
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
  const { data, nfts, platform, relations } = serverData;
  const pageTitle =
    data.identity == data.displayName
      ? `${data.displayName}`
      : `${data.displayName} (${data.identity})`;
  return (
    <ProfileMain
      fromServer
      domain={domain}
      relations={relations}
      nfts={nfts}
      data={data}
      pageTitle={pageTitle}
      platform={platform}
    />
  );
}

// Force static pages
export const dynamic = "force-static";
// CDN cache currently only works on nodejs runtime
export const runtime = "nodejs";
// Revalidate in seconds
export const revalidate = 604800;
