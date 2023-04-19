import React from "react";
import { NextSeo } from "next-seo";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { handleSearchPlatform } from "../utils/utils";
import ProfileMain from "../components/profile/ProfileMain";
import { LinksItem } from "../utils/api";

const NewProfile = ({ data, platform, pageTitle }) => {
  return (
    <div className="web3-profile container grid-xl">
      <NextSeo
        title={`${pageTitle} - Web3.bio`}
        description={
          data.description
            ? `${data.description} - View ${pageTitle} Web3 identity ${
                SocialPlatformMapping(platform).label
              } profile info, description, addresses, social links, NFT collections, POAPs, Web3 social feeds, crypto assets etc on the Web3.bio Link in bio page.`
            : `View ${pageTitle} Web3 identity ${
                SocialPlatformMapping(platform).label
              } profile info, description, addresses, social links, NFT collections, POAPs, Web3 social feeds, crypto assets etc on the Web3.bio Link in bio page.`
        }
        openGraph={{
          images: [
            {
              url: data.avatar
                ? data.avatar
                : `${process.env.NEXT_PUBLIC_BASE_URL}/img/web3bio-social.jpg`,
            },
          ],
        }}
      />
      <ProfileMain data={data} pageTitle={pageTitle} platform={platform} />
    </div>
  );
};

export async function getServerSideProps({ params, res }) {
  if (!params.domain)
    return {
      notFound: true,
    };
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${60 * 60 * 24 * 7}, stale-while-revalidate=${60 * 30}`
  );
  try {
    const platform = handleSearchPlatform(params.domain);
    if (
      ![
        PlatformType.dotbit,
        PlatformType.ens,
        PlatformType.farcaster,
        PlatformType.twitter,
        PlatformType.lens,
      ].includes(platform)
    )
      return {
        notFound: true,
      };
    const res = await fetch(
      `https://web3.bio/api/profile/${platform}/${params.domain}`
    );
    if (res.status == 404) return { notFound: true };
    const data = await res.json();
    const pageTitle =
      data.identity == data.displayName
        ? `${data.displayName}`
        : `${data.displayName} (${data.identity})`;

    return {
      props: {
        data: {
          ...data,
          linksData: Object.entries(data.links).map(([key, value]) => {
            return {
              platform: key,
              ...(value as LinksItem),
            };
          }),
        },
        platform,
        pageTitle,
      },
    };
  } catch (e) {
    return { props: { data: { error: e.message } } };
  }
}

export default NewProfile;
