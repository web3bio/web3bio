import IndexPageRender from "../components/search/IndexPage";
import { Footer } from "../components/shared/Footer";
import { PlatformData } from "../components/utils/platform";
import { handleSearchPlatform } from "../components/utils/utils";
import WalletButton from "../components/shared/WalletButton";

export async function generateMetadata({ searchParams }) {
  const searchTerm = searchParams?.s;
  const platform = searchParams?.platform;
  const params = new URLSearchParams();
  if (searchTerm) params.append("s", searchTerm);
  if (platform) params.append("platform", platform);
  const path = params.toString() ? `/?${params.toString()}` : "/";

  const defaultTitle =
    "Web3.bio - Web3 Identity Graph Search and Link in Bio Profile";
  const defaultDescription =
    "Web3.bio is a platform for Web3 and Web 2.0 Identity Graph search and link in bio profiles. It provides a list of relevant identities when searching for a Twitter handle, Ethereum address, ENS domain, Lens profile, Farcaster account, Unstoppable Domains, and other Web3 identities.";

  const title = searchTerm
    ? `${searchTerm} on ${
        platform
          ? PlatformData[platform.toLowerCase()].label
          : PlatformData[handleSearchPlatform(searchTerm)].label
      } - Web3.bio Search`
    : defaultTitle;
  const description = searchTerm
    ? `Search ${searchTerm} on ${
        platform
          ? PlatformData[platform.toLowerCase()].label
          : PlatformData[handleSearchPlatform(searchTerm)].label
      } to discover the Web3 decentralized profiles and identities associated with ${searchTerm}. Check out and explore the ${searchTerm} Web3 profile.`
    : defaultDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/${path}`,
    },
    openGraph: {
      type: "website",
      url: `/${path}`,
      siteName: "Web3.bio",
      title,
      description,
    },
    twitter: {
      title,
      description,
      site: "@web3bio",
      creator: "@web3bio",
    },
  };
}

export default function HomePage({}) {
  return (
    <>
      <div className="web3bio-container">
        <WalletButton />
        <div className="web3bio-cover flare"></div>
        {/* <div className="web3bio-header">
          <div className="container grid-lg">
            <div className="header-menu">
              <div className="web3bio-logo">
                <h1 className="text-pride">
                  WEB3
                  <br />
                  BIO
                </h1>
              </div>
              <div className="btn-group">
                <a href="#search" className="btn btm-sm btn-link">Search</a>
                <a href="#profile" className="btn btm-sm btn-link">Profile</a>
                <a href="#profile-api" className="btn btm-sm btn-link">API</a>
              </div>
              <div className="btn-group">
                <a href="#" className="btn btm-sm">Connect</a>
              </div>
            </div>
          </div>
        </div> */}
        <IndexPageRender />
      </div>
      <Footer />
    </>
  );
}