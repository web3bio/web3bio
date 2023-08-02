import { SocialPlatformMapping } from "../../utils/platform";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfileMain from "../../components/profile/ProfileMain";
import { fetchDataFromServer } from "../../utils/profile";

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
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio";
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
  const pageTitle =
    data.identity == data.displayName
      ? `${data.displayName}`
      : `${data.displayName} (${data.identity})`;
  return (
    <ProfileMain
      fromServer
      nfts={nfts}
      data={data}
      pageTitle={pageTitle}
      platform={platform}
    />
  );
}
