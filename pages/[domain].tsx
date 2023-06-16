import React, { useMemo, useCallback, memo } from "react";
import { NextSeo } from "next-seo";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { handleSearchPlatform } from "../utils/utils";
import ProfileMain from "../components/profile/ProfileMain";
import { fetchInitialNFTsData } from "../hooks/api/fetchProfile";

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

const ProfilePage = ({ data, platform, nfts }) => {
  const pageTitle = useMemo(() => {
    return data.identity == data.displayName
      ? `${data.displayName}`
      : `${data.displayName} (${data.identity})`;
  }, [data]);

  const renderMetatags = useCallback(
    () => ({
      title: `${pageTitle} - Web3.bio`,
      description:
        data.description ||
        `Explore ${pageTitle} ${
          SocialPlatformMapping(platform).label
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
    }),
    [data, platform, pageTitle]
  );

  return (
    <div className="web3-profile container grid-xl">
      <NextSeo {...renderMetatags()} />
      <ProfileMain
        nfts={nfts}
        data={data}
        pageTitle={pageTitle}
        platform={platform}
      />
    </div>
  );
};

export async function getServerSideProps({ params, res }) {
  if (!params.domain)
    return {
      notFound: true,
    };
  try {
    const platform = handleSearchPlatform(params.domain);
    if (
      ![
        PlatformType.ens,
        PlatformType.farcaster,
        PlatformType.twitter,
        PlatformType.lens,
        PlatformType.ethereum,
      ].includes(platform)
    )
      return {
        notFound: true,
      };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_END_POINT}/profile/${(platform ===
      PlatformType.ethereum
        ? PlatformType.ens
        : platform
      ).toLowerCase()}/${params.domain}`
    );

    if (response.status == 404) return { notFound: true };
    if (response.status === 504)
      return { props: { data: { error: "Timeout" } } };
    const data = await response.json();
    const remoteNFTs = await fetchInitialNFTsData(data?.identity);
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=${60 * 60 * 24 * 7}, stale-while-revalidate=${60 * 30}`
    );
    return {
      props: {
        data: { ...data, links: mapLinks(data?.links) },
        nfts: { ...remoteNFTs, nfts: mapNFTs(remoteNFTs?.nfts) },
        platform,
      },
    };
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    return { props: { data: { error: e.message } } };
  }
}

export default memo(ProfilePage);
