import IndexPageRender from "../components/search/IndexPage";
import { Footer } from "../components/shared/Footer";
import { PlatformData } from "../utils/platform";
import { handleSearchPlatform } from "../utils/utils";

export async function generateMetadata({ params, searchParams }, parent) {
  const searchTerm = searchParams?.s;
  const platform = searchParams?.platform;
  const pathName = searchTerm ? `/?s=${searchTerm}` : "/";
  const title = searchTerm
    ? `${searchTerm} - ${
        platform || PlatformData[handleSearchPlatform(searchTerm)].label
      }` || (await parent).title
    : (await parent).title;
  return {
    title,
    alternates: {
      canonical: pathName,
    },
    openGraph: {
      type: (await parent).openGraph?.type,
      siteName: (await parent).openGraph?.siteName,
      description: (await parent).openGraph?.description,
      images: (await parent).openGraph?.images,
      url: pathName,
      title,
    },
  };
}

export default function HomePage({}) {
  return (
    <>
      <div className="web3bio-container">
        <div className="web3bio-cover flare"></div>
        <IndexPageRender />
      </div>
      <Footer />
    </>
  );
}
