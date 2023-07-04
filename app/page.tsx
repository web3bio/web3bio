import IndexPageRender from "../components/search/IndexPage";
import { Footer } from "../components/shared/Footer";

export async function generateMetadata({ params, searchParams }, parent) {
  const searchTerm = searchParams?.s;
  const pathName = searchTerm ? `/?s=${searchTerm}` : "/";
  const title =
    searchTerm ||
    "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service";

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
