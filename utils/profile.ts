import { fetchInitialNFTsData } from "../hooks/api/fetchProfile";
import { PlatformType } from "./platform";
import { handleSearchPlatform, mapLinks } from "./utils";

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
        PlatformType.nextid,
      ].includes(platform)
    )
      return null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${domain}`
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
