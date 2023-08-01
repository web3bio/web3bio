import { fetchInitialNFTsData } from "../hooks/api/fetchProfile";
import { PlatformType } from "./platform";
import { handleSearchPlatform } from "./utils";

export async function fetchDataFromServer(domain: string) {
  if (!domain) return null;
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
      return null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${(platform ===
      PlatformType.ethereum
        ? PlatformType.ens
        : platform
      ).toLowerCase()}/${
        platform === PlatformType.farcaster
          ? domain.replaceAll(".farcaster", "")
          : domain
      }`,
      {
        cache: "no-store",
      }
    );
    if (response.status === 404) return null;
    const data = await response.json();
    if (!data || data.error) throw new Error(data.error);
    const remoteNFTs = await fetchInitialNFTsData(data?.address);

    return {
      data: { ...data, links: mapLinks(data?.links) },
      nfts: { ...remoteNFTs, nfts: mapNFTs(remoteNFTs?.nfts) },
      platform,
    };
  } catch (e) {
    return null;
  }
}

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
